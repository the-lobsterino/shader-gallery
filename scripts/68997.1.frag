precision highp float;
uniform vec2 resolution;
uniform float time;

#define MIN_DISTANCE 0.01

#define CAMERA_HEIGHT 100.0 * (0.5 + 0.5 * cos(time * 3.14 / 3.0)) + 1.0

// 霧の最大高度
#define H 50.0

float groundHeight(vec3 p, float height)
{
    return p.y - height;
}

vec3 getNormal(vec3 p)
{
    return vec3(0, 1, 0);
}

// 地面へのトレーシング
// r0 : Rayの開始位置
// rd : Rayの向き
// 地面へのトレーシングを行う
void traceGround(vec3 r0, vec3 rd, float height, out float isHit, out float t)
{
    // Rayの進行方向へ2点をとり、高さが最小になる点を探していく
    float t2 = 20000.0; // Rayの遠点
    float h2 = groundHeight(r0 + rd * t2, height); // 遠点の高さ
    if (h2 > MIN_DISTANCE) 
    {
        return;
    }

    float t1 = 0.0; // Rayの近点
    float h1 = groundHeight(r0 + rd * t1, height); // 近点の高さ

    float tm;
    float hm;

    t = 0.0;
    vec3 ray;
    for(int i = 0; i < 1; i++)
    {
        tm = mix(t1, t2, h1/(h1 - h2)); // 二つの高さの比で内分する位置を求める
        hm = groundHeight(r0 + rd * tm, height); // 内分位置の高さを求める
        
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

    if (hm <= MIN_DISTANCE)
    {
        isHit = 1.0;
    }
    t = tm;
}


// Rayが進む間に通過する霧の量
float fogDensity(vec3 rd, float h)
{
    vec3 n = vec3(0, 1, 0);
    if (rd.y > 0.0)
    {
        return 0.5 * pow(max(0.0, H - h), 2.0) / dot(rd, n);
    }
    else
    {
        return 0.5 * pow(min(h, H), 2.0) / dot(-rd, n);
    }
}

float xor(float a, float b)
{        
    return abs(a - b);
}

void main()
{
    vec3 cPos = vec3(0, CAMERA_HEIGHT, 0); // camera position

    vec2 p = (gl_FragCoord.xy - resolution.xy * 0.5) / max(resolution.x, resolution.y);

    vec3 cUp = normalize(vec3(0, 1, 0)); // camera up
    vec3 cDir = normalize(vec3(0,-0.1,1)); // camera direction
    vec3 cSide = cross(cDir, cUp); // camera side

    vec3 rd = normalize(cSide * p.x + cUp * p.y + cDir); // ray direction

    float isHit;
    float dist;
    traceGround(cPos, rd, 0.0, isHit, dist);
    vec3 groungRay = cPos + rd * dist;
    groungRay = step(fract(groungRay * 0.1), vec3(0.5));
    vec3 groundColor = xor(groungRay.x, groungRay.z) * vec3(1);


    float fog = 1.0 - exp(-fogDensity(rd, cPos.y) * 0.0005);
    vec3 fogColor = vec3(1);

    gl_FragColor = vec4(mix(groundColor, fogColor, fog), 1);
}