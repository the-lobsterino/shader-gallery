precision highp float;
uniform vec2 resolution;
uniform float time;

#define PI 3.141592
#define ROTATE_TIME (radians(-105.0))
#define BOUND_TIME (time * PI / 2.0)
#define FRESNEL_TIME (time * PI * 2.0)

// ガウス関数の標準偏差
#define STDEV (12.0)

// ガウスぼかしのカーネルサイズ (大きくすると重くなります)
// #define BLUR_SAMPLE_N 10
#define BLUR_SAMPLE_N 6

// ぼかし範囲(ピクセル数)
#define BLUR_RANGE 12.0

// 光源への向きベクトル
#define LIGHT normalize(vec3(0,.4,1))

// 太陽の色
#define SUN_COLOR vec3(1.0, 0.9, 0.8)

// 太陽光の色
#define LIGHT_COLOR vec3(1.0, 0.9, 0.78)

// Rayのヒット判定 距離
#define RAY_TOLERANCE 0.05

// カメラの注目先
#define CAMERA_LOOK_TARGET vec3(0, 1, 0)

// カメラフォーカス
#define CAMERA_FOCUS 1.5

// カメラ位置
#define CAMERA_POSITION 9.0

// 環境光の色
// #define AMBIENT_COLOR (vec3(0.0, 0.5, 1.0) * 0.1)
// #define AMBIENT_COLOR (vec3(60, 50, 200) / 255.0  * 0.1)
// #define AMBIENT_COLOR (vec3(60, 50, 200) / 255.0  * 0.1)
#define AMBIENT_COLOR (vec3(60, 50, 200) / 255.0  * 0.12)

// フォグ
#define FOG_DISTANCE_SCALE 0.5
#define FOG_START_DISTANCE (2.5)

// 空の色
#define SKY_COLOR (vec3(140, 50, 200) / 255.0 * 0.06)

// 球の大きさ
#define SPHERE_SIZE 1.0

// 影の濃さ
#define SHADOW_INTENSITY 0.5

// 露光
#define EXPOSURE 2.0


// ボール位置の計算
vec3 computeBallPosition()
{
    // float g = -9.8; // 重力加速度
    // float v0 = 8.0; // t=0の速度
    // float y0 = SPHERE_SIZE / 2.0; // t=0でのY座標

    // float T = -2.0 * v0 / g; // 跳ね返ったボールが着地するまでの時間周期

    // float t = mod(BOUND_TIME, T); // 時刻
    // float y = v0 * t + 0.5 * g * t*t + y0;

    return vec3(0, 
        2.0 + 0.5 * sin(time * PI), 0);

    // return vec3(0, y, 0);
}

// 点p から オブジェクトの表面までの距離
float sdf_object(vec3 p)
{
    float size = 1.2; // ボールの大きさ
    float bounce = 4.0;
    vec3 pos = computeBallPosition();
    return length(p - pos) - size;
}

// 地面への距離
float sdf_ground(vec3 p)
{
    return p.y;
}

// オブジェクトへのトレーシングを行う
// r0 : Rayの開始位置
// rd : Rayの向き
// isHit : Rayが球に当たったら1.0
// t : Rayが進んだ距離
// return : Rayの位置
vec3 traceSphere(vec3 r0, vec3 rd, out float isHit, out float t)
{
    t = 0.0;
    vec3 ray;
    for(int i = 0; i < 12; i++)
    {
        ray = r0 + t * rd;      
        float d = sdf_object(ray);
        if (d < RAY_TOLERANCE)
        {         
            isHit = 1.0;
            break;   
        }  
        t += d;
    }
    return ray;
}

// 光源と球が作る影のトレーシング
float traceShadow(vec3 r0)
{
    float t = 0.0;
    float isHit = 0.0;
    for(int i = 0; i < 4; i++)
    {
        vec3 ray = r0 + t * LIGHT;      
        float d = sdf_object(ray);
        if (d < 0.01)
        {         
            isHit = 1.0;
            break;   
        }  
        t += d;
    }
    return isHit;
}

// 地面へのトレーシングを行う
void traceGround(vec3 r0, vec3 rd, out float isHit, out float t)
{
    // Rayの進行方向へ2点をとり、高さが最小になる点を探していく
    float t2 = 1000.0; // Rayの遠点
    float h2 = sdf_ground(r0 + rd * t2); // 遠点の高さ
    if (h2 > RAY_TOLERANCE) 
    {
        return;
    }

    float t1 = 0.0; // Rayの近点
    float h1 = sdf_ground(r0 + rd * t1); // 近点の高さ

    float tm;
    float hm;

    t = 0.0;
    vec3 ray;
    for(int i = 0; i < 1; i++)
    {
        tm = mix(t1, t2, h1/(h1 - h2)); // 二つの高さの比で内分する位置を求める
        hm = sdf_ground(r0 + rd * tm); // 内分位置の高さを求める
        
        if (hm < 0.0) // 内分位置が、地面の下にもぐっている場合
        {
            // 遠点を手前に戻す
            t2 = tm;
            h2 = hm;
        }
        else // 地面の上にある場合
        {
            // 近点を進める
            t1 = tm;
            h1 = hm;
        }
    }

    if (hm <= RAY_TOLERANCE)
    {
        isHit = 1.0;
    }
    t = tm;
}

// 球の法線を求める
vec3 getNormalSphere(vec3 p)
{
    float d = RAY_TOLERANCE / 2.0;
    return normalize(vec3(
        sdf_object(p + vec3(d,0,0)) - sdf_object(p - vec3(d,0,0)),
        sdf_object(p + vec3(0,d,0)) - sdf_object(p - vec3(0,d,0)),
        sdf_object(p + vec3(0,0,d)) - sdf_object(p - vec3(0,0,d))
    ));
}

// 球のライティング
// v : 視線ベクトル
// n : 法線ベクトル
vec3 renderLighting(vec3 v, vec3 n)
{
    // ライティングの計算
    vec3 l = LIGHT; // 光源への向きベクトル
    vec3 r = reflect(l, n);
    
    float a = 1.0; // 環境光 反射強度 (ambient)
    float d = 0.8; // 拡散反射 強度 (diffuse)
    float s = 1.0; // 鏡面反射 強度 (specular)
    float gloss = 150.0; // 光沢度
    
    float fresnel = clamp(1.0 - dot(-v,n), 0.0, 1.0);
    fresnel = pow(fresnel, mix(2.5, 6.0, 0.5 + 0.5 * sin(FRESNEL_TIME)));
    fresnel *= 1.5;

    // Phonn 反射
    return a * AMBIENT_COLOR
         + d * LIGHT_COLOR * clamp(dot(l, n), 0.0, 1.0)
         + s * LIGHT_COLOR * pow(clamp(dot(v, r), 0.0, 1.0), gloss)
         + fresnel * LIGHT_COLOR
         ;
}

// 地面のUVを元に地面のベースカラーを計算
vec3 groundBaseColor(vec2 uv)
{
    float lineSize = 0.02;
    float line = max(step(uv.x, lineSize), step(uv.y, lineSize));
    return mix(LIGHT_COLOR, vec3(0, 0, 0), line);
}

// 大気散乱の計算(The Phase Function)
// https://developer.nvidia.com/gpugems/gpugems2/part-ii-shading-lighting-and-shadows/chapter-16-accurate-atmospheric-scattering
// vDotL : Rayと光線ベクトルの内積(cosΘ)
// g : 散乱の非対称因子
float phaseEquation(float vDotL, float g)
{
    float g2 = g * g;
    return (3.0 * (1.0 - g2) * (1.0 - g) * (1.0 + vDotL * vDotL))
         / pow(2.0 * (2.0 + g2) * (1.0 + g2 - 2.0 * g * vDotL), 1.5);  
}

// The Phase Functionに露光の補正をかけたもの
float phaseEquationExp(float vDotL, float g)
{
    return 1.0 - exp(-phaseEquation(vDotL, g) * EXPOSURE);
}

// 空の描画
vec3 renderSky(vec3 v)
{
    float vDotL = clamp(dot(v, LIGHT), -1.0, 1.0);
    vec3 sun = 
        + phaseEquation(vDotL, 0.99)  * SUN_COLOR * 0.3
        + phaseEquationExp(vDotL, 0.7) * LIGHT_COLOR * 0.12
        ;
    return SKY_COLOR + sun;
}

vec3 getPixel(vec2 texcoord)
{
    vec2 p = (2.0 * texcoord.xy - resolution.xy) / min(resolution.x, resolution.y);

    // camera
    vec3 cPos = CAMERA_POSITION * vec3(cos(ROTATE_TIME), 0.0, sin(ROTATE_TIME)) + vec3(0, 2.0, 0);
    // vec3 cPos = vec3(0,2,-CAMERA_POSITION);
    vec3 cDir = normalize(CAMERA_LOOK_TARGET - cPos + vec3(0,0.5,0)); 
    vec3 cUp = normalize(vec3(0,1,0)); 
    vec3 cSide = normalize(cross(cUp,cDir)); 
    
    vec3 r0 = cPos;
    float focus = CAMERA_FOCUS;
    vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir * focus); // ray direction
    vec3 v = rd;

    // RayがHitしたかどうか
    float isHitSphere, isHitGround; // Rayが当たっていない場合は0.0, 当たっている場合は1.0
    
    // 地面の描画
    float t;
    traceGround(r0, rd, isHitGround, t);

    // 地面のベースカラー
    vec3 rayGround = r0 + rd * t; // 地面にヒットしたRay位置
    vec2 groundUV = fract(rayGround).xz;
    vec3 groundColor = groundBaseColor(groundUV);
    groundColor *= 0.8;

    // // シャドウの描画
    // float groundShadow = traceShadow(rayGround);
    // groundColor = mix(groundColor, AMBIENT_COLOR, SHADOW_INTENSITY * groundShadow);

    // 空の描画
    vec3 skyColor = renderSky(v);

    // フォグ
    float fogZ = t * FOG_DISTANCE_SCALE - FOG_START_DISTANCE;
    fogZ = max(0.0, fogZ); // 0.0を下回らないようにする
    float fog = exp(-fogZ);
    groundColor = mix(skyColor, groundColor, fog * isHitGround);

    // 球の描画
    traceSphere(r0, rd, isHitSphere, t);  
    vec3 raySphere = r0 + rd * t; 
    vec3 n = getNormalSphere(raySphere); // 球の法線
    vec3 sphereColor = renderLighting(rd, n); 

    // float exposure = 2.0;
    vec3 c = mix(groundColor, sphereColor, isHitSphere); 
    // c = vec3(1.0) - exp(-c * exposure); // 露光

    return c;
}

// ガウス関数の計算
float gaussianFunction(vec2 p)
{
    return exp(- dot(p, p) / (2.0 * STDEV)) 
        / (sqrt(2.0 * PI * STDEV));
}

// ガウスぼかし
// center : ガウスぼかしの中心
vec3 gaussianBlur(vec2 p)
{    
    vec2 delta = vec2(BLUR_RANGE / float(BLUR_SAMPLE_N));
    vec3 total;
    float gaussTotal = 0.0;
    for(int i = -BLUR_SAMPLE_N / 2; i <= BLUR_SAMPLE_N / 2; i++)
    {
        for(int j = -BLUR_SAMPLE_N / 2; j <= BLUR_SAMPLE_N / 2; j++)
        {
            vec2 d = delta * vec2(float(i), float(j));
            float gauss =  gaussianFunction(d);
            gaussTotal += gauss;
            total += gauss * getPixel(p + d);
        }
    }
    return total / gaussTotal;
}

void main()
{
    vec2 p = gl_FragCoord.xy / resolution.xy;
    vec2 mask_size = vec2(0.15, 0.2);
    float t0 = time * PI / 2.0;
    vec2 mask_center = vec2(0.5, 0.55) + vec2(0.25 * cos(t0), 0.25 * sin(t0));
    vec2 mask1 = step(abs(p - mask_center), mask_size);
    vec2 mask2 = step(abs(p - mask_center), mask_size - 0.003);
    float box1 = mask1.x * mask1.y;
    float box2 = mask2.x * mask2.y;
    float line = box1 - box2;
    vec3 c = mix(getPixel(gl_FragCoord.xy), 1.5 * gaussianBlur(gl_FragCoord.xy), box1);
    gl_FragColor = vec4(c + line * 0.15, 1);
}