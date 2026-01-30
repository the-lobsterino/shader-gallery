#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

// 地面への距離
float sdf_ground(vec3 p)
{
    return p.y;
}

// 地面へのトレーシングを行う
void trace_ground(vec3 r0, vec3 rd, out float isHit, out float t)
{
    // Rayの進行方向へ2点をとり、高さが最小になる点を探していく
    float t2 = 1000.0; // Rayの遠点
    float h2 = sdf_ground(r0 + rd * t2); // 遠点の高さ
    if (h2 > 0.1) 
    {
        return;
    }

    float t1 = 0.0; // Rayの近点
    float h1 = sdf_ground(r0 + rd * t1); // 近点の高さ

    float tm;
    float hm;

    t = 0.0;
    vec3 ray;
    for(int i = 0; i < 12; i++)
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

    if (hm < 0.01)
    {
        isHit = 1.0;
    }
    t = tm;
}

void main()
{
    vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);

    vec3 cPos = vec3(0.0, 1.0, 0.0);
    vec3 cDir = normalize(vec3(0, -0.2, 1)); 
    vec3 cUp = normalize(cross(cDir,vec3(1,0,0))); 
    vec3 cSide = normalize(cross(cUp,cDir)); 
    
    vec3 r0 = cPos;
    vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir); // ray direction

    float isHit;
    float t;
    trace_ground(r0, rd, isHit, t);

    vec3 ray = r0 + rd * t;
    ray = fract(ray);
    vec3 groundColor = vec3(ray.xz, 0);

    gl_FragColor = vec4(groundColor, 1);
}