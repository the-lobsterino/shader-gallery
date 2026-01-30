#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

#define PI 3.1415926535897932
#define DELTA 1.0e-3
#define INFTY 1.0e4
#define MAX_STEP 128

// 2次元座標上の回転
vec2 rot2d(vec2 vec, float angle)
{
    mat2 rotMat = mat2(
        cos(angle), -sin(angle),
        sin(angle), cos(angle)
    );

    return vec * rotMat;
}

// 3次元上の回転
vec3 rot3d(vec3 vec, vec3 axis, float angle)
{
    axis = normalize(axis);

    mat3 rotMat = mat3(
        axis.x * axis.x * (1.0 - cos(angle)) + cos(angle),
        axis.y * axis.x * (1.0 - cos(angle)) + axis.z * sin(angle),
        axis.z * axis.x * (1.0 - cos(angle)) - axis.y * sin(angle),
        axis.x * axis.y * (1.0 - cos(angle)) - axis.z * sin(angle),
        axis.y * axis.y * (1.0 - cos(angle)) + cos(angle),
        axis.z * axis.y * (1.0 - cos(angle)) + axis.x * sin(angle),
        axis.x * axis.z * (1.0 - cos(angle)) + axis.y * sin(angle),
        axis.y * axis.z * (1.0 - cos(angle)) - axis.x * sin(angle),
        axis.z * axis.z * (1.0 - cos(angle)) + cos(angle)
    );

    return vec * rotMat;
}

// hsv から rgb に変換する
vec3 hsvToRgb(float h, float s, float v)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(h + K.xyz) * 6.0 - K.www);
    return v * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), s);
}

// 光線を表す構造体
struct ray
{
    vec3 pos;
    vec3 dir;
};

// カメラの位置から光線を作成する
ray createRay(vec3 pos, vec3 dir, vec3 up)
{
    vec2 co = gl_FragCoord.xy;
    vec2 res = resolution;
    vec2 uv = (2.0 * co - res) / min(res.x, res.y);

    vec3 side = cross(up, dir);

    return ray(pos, normalize(uv.x * side + uv.y * up  + dir));
}

// オブジェクトからの距離を取得する
float getDist(vec3 pos)
{
    return length(pos) - 1.0;
}

// オブジェクトの法線ベクトルを取得する
vec3 getNorm(vec3 pos)
{
    vec3 norm;

    vec3 dx = vec3(DELTA, 0.0, 0.0);
    vec3 dy = vec3(0.0, DELTA, 0.0);
    vec3 dz = vec3(0.0, 0.0, DELTA);

    norm.x = getDist(pos) - getDist(pos - dx);
    norm.y = getDist(pos) - getDist(pos - dy);
    norm.z = getDist(pos) - getDist(pos - dz);

    return normalize(norm);
}

// レイマーチングを行う
bool tryRayMarch(inout ray marchRay, out float marchDist)
{
    marchDist = 0.0;

    for(int i = 0; i < MAX_STEP; ++i)
    {
        float dist = getDist(marchRay.pos);

        if(abs(dist) < DELTA) return true;
        if(abs(dist) > INFTY) return false;

        marchRay.pos += marchRay.dir * dist;
        marchDist += dist;
    }

    return false;
}

// レンダリングを行う
void render()
{
    vec3 pos = vec3(0.0, 0.0, -2.0);
    vec3 dir = vec3(0.0, 0.0, 1.0);
    vec3 up = vec3(0.0, 1.0, 0.0);

    ray marchRay = createRay(pos, dir, up);

    float marchDist = 0.0;

    if(tryRayMarch(marchRay, marchDist))
    {
        vec3 light = normalize(vec3(2.0, 4.0, -5.0));
        vec3 norm = getNorm(marchRay.pos);
        float value = dot(light, norm);
        gl_FragColor = vec4(vec3(value), 1.0);
    }

    else
    {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}

void main()
{
    render();
}