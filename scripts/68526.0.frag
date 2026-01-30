precision highp float;
uniform float time;
uniform vec2 resolution;



// 屈折率
#define ETA 0.95

#define LINE_SIZE 0.03

float sdf_plane(vec3 p)
{
    // 平面までの距離
    return p.y + 8.0;    
}

mat2 m2 = mat2(1.6,-1.2,1.2,1.6); // 2倍スケール + 回転行列
float speed = 3.141592 / 2.0;
float sdf_water(vec3 p)
{
    p.xz *= 0.5;

    // wave
    float wave;
    float waveHeight = 1.0;
    
    for (int i = 0; i < 7; i++)
    {
      p.xz *= m2;
      wave += p.y - waveHeight * sin(p.x * 0.07 + p.z * 0.21  - time * speed);
      waveHeight *= 0.7;
    }
    wave += 12.0;
    return wave;
}

// 水面の法線を求める
vec3 getNormalWater(vec3 p)
{
    // Pを微小変化させた時のSDFの変化を法線とみなす
    float diff = 0.01;
    return normalize(vec3(
        sdf_water(p + vec3(diff,0,0)) - sdf_water(p - vec3(diff,0,0)),
        sdf_water(p + vec3(0,diff,0)) - sdf_water(p - vec3(0,diff,0)),
        sdf_water(p + vec3(0,0,diff)) - sdf_water(p - vec3(0,0,diff))
    ));
}

// 範囲[a, b]を[c, d]へ変換
float remap(float a, float b, float c, float d, float x)
{
    return (x - a) / (b - a) * (d - c) + c;
}

// 水面に対するレイマーチング
void raymarch_water(in vec3 cPos, in vec3 rd, out float isHit, out float t, out vec3 rayPos)
{
    float st = 0.25;
    for (int i = 0; i< 500; i++)
    {
        vec3 rp = cPos + t * rd;
        if (sdf_water(rp) < 0.01)
        {
            isHit = 1.0;
            rayPos = rp;
            break;
        }
        t += st;
    }
}

// 水面に沈んでいる平面に対するレイマーチング
void raymarch_plane(in vec3 cPos, in vec3 rd, out float isHit, out float t, out vec3 rayPos)
{
    float st = 1.0;
    for (int i = 0; i< 50; i++)
    {
        vec3 rp = cPos + t * rd;
        if (sdf_plane(rp) < 0.01)
        {
            isHit = 1.0;
            rayPos = rp;
            break;
        }
        t += st;
    }
}


#define WATER_COLOR_1 vec3(86, 181, 223)/255.0
#define WATER_COLOR_2 vec3(3, 48, 149)/255.0
#define UNDERWATER_COLOR_1 vec3(65, 177, 192)/255.0
#define UNDERWATER_COLOR_2 vec3(3, 121, 163)/255.0
#define GRID_SCALE 2.5
void main()
{
    vec2 reso=resolution;
    vec2 p=(gl_FragCoord.xy*2.-reso)/min(reso.x, reso.y) * 1.7;
    vec3 cPos = vec3(0,10,0); // camera pos
    float cRadian = radians(-75.0);
    vec3 cForward = normalize(vec3(0, sin(cRadian), cos(cRadian)));
    vec3 cUp = cross(vec3(-1,0,0), cForward); // camera up
    vec3 cSide = cross(cForward, cUp);

    float isHitWater = 0.0; 
    vec3 rd = normalize(p.x * cSide + p.y * cUp + cForward);  // Rayの進行方向
    float rayWaterLength = 0.0; // Rayが水面にぶつかるまでに進んだ距離
    vec3 waterHit; // RayのHit位置
    raymarch_water(cPos, rd, isHitWater, rayWaterLength, waterHit);

    vec3 planeHit; // RayがPlaneにHitした位置
    float isHitPlane = 0.0;
    float rayPlaneLength; // Rayが平面にぶつかるまでに進んだ距離

    vec3 waterNormal = getNormalWater(waterHit); // 水面Hit位置での法線
    rd = refract(rd, waterNormal, ETA);
    raymarch_plane(waterHit, rd, isHitPlane, rayPlaneLength, planeHit);

    float planeGrid = max( // 水面で屈折したRayが水底にぶつかって描かれるグリッド
        step(fract(planeHit.x / GRID_SCALE), LINE_SIZE),
        step(fract(planeHit.z / GRID_SCALE), LINE_SIZE)
    );
    vec3 planeColor = mix(UNDERWATER_COLOR_2, UNDERWATER_COLOR_1, planeGrid);

    float waterMix = smoothstep(20.0, 10.0, rayPlaneLength);
    float distance_fade = smoothstep(20.0, 4.0, length(planeHit.xz));
    gl_FragColor = vec4(
        smoothstep(10.0, 30.0, rayWaterLength) * WATER_COLOR_1 * 0.2 // 水面の色
        + smoothstep(50.0, 20.0, length(planeHit.xz)) * planeColor // 水底の色
        , 1);
}