// https://glslsandbox.com/e
precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float kPi = 3.1415926535;
const float kQuarterPi = kPi / 4.0;
const float kInvQuarterPi = 1.0 / kQuarterPi;
const float kOneThirdPi = kPi / 3.0;
const float kInvOneThirdPi = 1.0 / kOneThirdPi;
const float kTwoThirdPi = kPi * (2.0 / 3.0);
const float kInvTwoThirdPi = 1.0 / kTwoThirdPi;
const float kOneSixthPi = kPi / 6.0;


float sdf(vec3 rayPos, out vec3 color);
vec3 getNormal(vec3 p);
float sq(float x);
float sdOctahedron(vec3 p, float s);
float sdCappedCylinder(vec3 p, float h, float r);
float sdTorus(vec3 p, vec2 t);
mat2 rot(float angle);
vec2 rotate2D(vec2 p, float angle);
vec2 rotate2D(vec2 p, vec2 pivot, float angle);


void main(void)
{
    const float kMinRayDist = 0.001;
    const float kMaxRayDist = 1000.0;
    const int kLoopMax = 256;
    const float kScreenZ = 4.0;
    const vec3 kLightDir = normalize(vec3(0.0, 2.0, 15.0));
    const vec3 kBaseCameraPos = vec3(0.0, 0.0, 10.0);

    vec3 cameraPos = kBaseCameraPos;
    // cameraPos.x = sin(time) * 2.0;

    vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    vec3 rayDir = normalize(vec3(position, kScreenZ) - cameraPos);

    // Distance.
    float d = 0.0;
    // Total distance.
    float t = 0.0;

    vec3 color = vec3(1.0, 1.0, 1.0);
    for (int i = 0; i < kLoopMax; i++) {
        vec3 rayPos = cameraPos + rayDir * t;
        d = sdf(rayPos, color);
        if (d < kMinRayDist) {
            break;
        }

        t += d;
        if (kMaxRayDist < t) {
            discard;
        }
    }

    if (kMinRayDist < d) {
        discard;
    }

    vec3 finalRayPos = cameraPos + rayDir * t;
    vec3 normal = getNormal(finalRayPos);

    // Half-Labbert
    float nDotL = dot(normal, kLightDir);
    float diffuse = sq(nDotL * 0.5 + 0.5);

    gl_FragColor = vec4(color * diffuse, 1.0);
}


float sdf(vec3 rayPos, out vec3 color)
{
    const float kOctahedronSize = 0.07;
    vec3 colors[6];
    colors[0] = vec3(0.8, 0.4, 0.4);  // R
    colors[1] = vec3(0.8, 0.8, 0.4);  // Y
    colors[2] = vec3(0.4, 0.8, 0.4);  // G
    colors[3] = vec3(0.4, 0.8, 0.8);  // C
    colors[4] = vec3(0.4, 0.4, 0.8);  // B
    colors[5] = vec3(0.8, 0.4, 0.8);  // M

    float radius = 0.25 + sin(time) * 0.05;

    float d = sdTorus(rayPos, vec2(radius, 0.01));
    color = vec3(1.0, 1.0, 1.0);

    rayPos.xy = rotate2D(rayPos.xy, time);
    float xyAngle = atan(rayPos.y, rayPos.x);

    float rotUnit1 = floor(xyAngle * kInvOneThirdPi);
    vec3 rayPos1 = rayPos;
    rayPos1.xy = rotate2D(rayPos1.xy, kOneThirdPi * rotUnit1 + kOneThirdPi / 2.0);

    float nd1 = sdOctahedron(rayPos1 - vec3(radius, 0.0, 0.0), kOctahedronSize);
    if (d > nd1) {
        d = nd1;
        int idx = int(rotUnit1);
        color = idx == 0 ? colors[0]
            : idx == 1 ? colors[1]
            : idx == 2 ? colors[2]
            : idx == -3 ? colors[3]
            : idx == -2 ? colors[4]
            : colors[5];
    }

    vec2 posXY1 = rotate2D(vec2(radius, 0.0), kOneSixthPi);
    vec2 posXY2 = rotate2D(vec2(radius, 0.0), kTwoThirdPi + kOneSixthPi);
    vec2 posCenterXY = (posXY1 + posXY2) * 0.5;
    float dist12 = length(posXY2 - posXY1) * 0.5;
    for (int i = 0; i < 2; i++) {
        for (int j = 0; j < 3; j++) {
            vec3 rayPos2 = rayPos;
            rayPos2.xy = rotate2D(rayPos2.xy, kTwoThirdPi * float(j + 1) + kOneThirdPi * float(i));
            rayPos2.xy -= rotate2D(posCenterXY, posCenterXY, kTwoThirdPi * float(j));
            float nd2 = sdCappedCylinder(rayPos2, dist12, 0.01);
            if (d > nd2) {
                d = nd2;
                color = colors[j * 2 + i];
            }
        }
    }

    return d;
}


vec3 getNormal(vec3 p)
{
    const float h = 0.001;
    const vec2 k = vec2(1.0, -1.0);
    const vec2 kh = k * h;

    vec3 color_;
    return normalize(
        k.xyy * sdf(p + kh.xyy, color_)
            + k.yyx * sdf(p + kh.yyx, color_)
            + k.yxy * sdf(p + kh.yxy, color_)
            + k.xxx * sdf(p + kh.xxx, color_));
}


float sq(float x)
{
    return x * x;
}


float sdOctahedron(vec3 p, float s)
{
    return (dot(abs(p), vec3(1.0, 1.0, 1.0)) - s) * 0.57735027;
}


float sdCappedCylinder(vec3 p, float h, float r)
{
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(h, r);
    return min(0.0, max(d.x, d.y)) + length(max(d, 0.0));
}


float sdTorus(vec3 p, vec2 t)
{
    // t.x: radius of torus
    // t.y: thickness of torus

    // vec2 q = vec2(length(p.xz) - t.x, p.y);
    // return length(q) - t.y;
    vec2 q = vec2(length(p.xy) - t.x, p.z);
    return length(q) - t.y;
}


vec2 rotate2D(vec2 p, vec2 pivot, float angle)
{
    return rotate2D(p - pivot, angle) + pivot;
}


vec2 rotate2D(vec2 p, float angle)
{
    return p * rot(angle);
}


mat2 rot(float angle)
{
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, s, -s, c);
}
