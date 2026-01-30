// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

// レイを進める回数
#define N 300

// レイが接触したとみなす距離
#define RAY_MIN_DISTANCE 0.01

// #define EDGE_SIZE 0.15
#define EDGE_SIZE 0.15

#define COMMON_SCALE 1.8

#define CAMERA_X (0.0)

// カメラ移動スピード
#define CAMERA_SPEED (BOX_INTERVAL_XZ * 10.0)

// ボックスの間隔(XZ)
#define BOX_INTERVAL_XZ (4.0)

// ボックスの大きさ
#define BOX_SIZE_Y (1.0)

// 配置のランダム値
#define BOX_RANDOM_Y (0.5)

// 微小な値
#define EPS 0.01

// ランダム
float random (vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233)))* 43758.5453123);
}

// 距離関数(箱)
float sdBox( vec3 p, vec3 b )
{
    p.z = 0.0;
    vec3 d = abs(p) - b;
    // return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
    return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

// 距離関数
float sdf(vec3 p, vec3 size)
{
    float rand_y = BOX_RANDOM_Y * random(floor(p.xz / BOX_INTERVAL_XZ) * BOX_INTERVAL_XZ);
    p = mod(p , BOX_INTERVAL_XZ) - BOX_INTERVAL_XZ / 2.0;
    p.y += rand_y;

    return sdBox(p, size);
}

vec3 getNormal(vec3 p, vec3 size) {
    return normalize(vec3(
        sdf(p + vec3(EPS, 0.0, 0.0), size) - sdf(p + vec3(-EPS,  0.0,  0.0), size),
        sdf(p + vec3(0.0, EPS, 0.0), size) - sdf(p + vec3( 0.0, -EPS,  0.0), size),
        sdf(p + vec3(0.0, 0.0, EPS), size) - sdf(p + vec3( 0.0,  0.0, -EPS), size)
    ));
}

float raymarch(vec2 uv, vec3 size)
{
    vec3 pos = vec3(CAMERA_X, sin(time * 1.0) * 2.0, CAMERA_SPEED * time); // 点の現在位置    
    vec3 ray = vec3(uv.x, uv.y, 1); // レイの向き   

    float total = 0.0; // 進んだ距離

    float dist = 0.0;
    float hit = 0.0;

    for (int i = 0; i < N; i++)
    {
        dist = max(0.0, sdf(pos, size));
        pos += ray * dist; // 点を進める

        total += dist;

        // rayとオブジェクトとの距離をもとめる
        if (dist < RAY_MIN_DISTANCE){
            hit = 1.0;
            break;
        }
        if (total > 80.0)
        {
            break;
        }
    }

    float c = 1.0 / (1.0 + total * 0.01);
    return c;
}

void main()
{
    vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) /  max(resolution.x, resolution.y);

    float c = 
          raymarch(uv, vec3(1, BOX_SIZE_Y, 1))
        - raymarch(uv, vec3(1, BOX_SIZE_Y, 1) - vec3(EDGE_SIZE, EDGE_SIZE, EDGE_SIZE))
        ;

    gl_FragColor = vec4(c, c, c, 1);
}