//// rayの定義に視野角を使うか
#define RAY_FOVY

//// scaleアニメーションするか
// #define SCALE_ANIMATION

//// rotateするか
// #define USE_ROTATE

#ifdef GL_ES
precision mediump float;
#endif

//// 各種パラメータ設定
#define PI 3.14159265
#define INFINITY 1. / 0.
#define RAY_HIT_THRESHOLD 0.001
#define MAX_MARCHING_ITTRATION 256


//// enum
#define OR  0
#define AND 1
#define SUB 2
#define M_BASE 0.
#define M_CROSS 1.

uniform float time;
uniform vec2 resolution;

vec2 dotedRandom(vec2 st){
    st = vec2( dot(st,vec2(127.1,222.7)),
                    dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*437538.5453123);
}

float perlinNoise(vec2 st) 
{
    vec2 p = floor(st);
    vec2 f = fract(st);
    vec2 u = f*f*(3.0-1.0*f);

    vec2 v00 = dotedRandom(p+vec2(0,0));
    vec2 v10 = dotedRandom(p+vec2(1,0));
    vec2 v01 = dotedRandom(p+vec2(0,1));
    vec2 v11 = dotedRandom(p+vec2(1,1));

    return mix( mix( dot( v00, f - vec2(0,0) ), dot( v10, f - vec2(1,0) ), u.x ),
                    mix( dot( v01, f - vec2(0,1) ), dot( v11, f - vec2(1,1) ), u.x ), 
                    u.y) + 0.5;
}

float fBm (vec2 st) 
{
    float f = 0.;
    vec2 q = st;

    f += 0.25000 * perlinNoise( q );
    q *= 2.01;
    f += 0.2500 * perlinNoise( q );
    q *= 2.02;
    f += 0.1250 * perlinNoise( q );
    q *= 2.03;
    f += 0.0625 * perlinNoise( q );
    q *= 2.01;

    return f;
}

vec3 getRayDirection(vec3 cPosition, vec3 cDirection, vec2 fPosition)
{
#ifdef RAY_FOVY
    float angle = 90.;
    float fovy = angle * 0.5 * PI / 180.;
    return normalize(vec3(sin(fovy) * fPosition.x, sin(fovy) * fPosition.y, -cos(fovy)));
#else
    vec3 cUp  = vec3(0.0,  1.0,  0.0);
    vec3 cSide = cross(cDirection, cUp);
    float targetDepth = 1.0;
    return normalize(cSide * fPosition.x + cUp * fPosition.y + cDirection * targetDepth);
#endif
}

vec3 rotate(vec3 p, float angle, vec3 axis){
    vec3 a = normalize(axis);
    float s = sin(angle);
    float c = cos(angle);
    float r = 1.0 - c;
    mat3 m = mat3(
        a.x * a.x * r + c,
        a.y * a.x * r + a.z * s,
        a.z * a.x * r - a.y * s,
        a.x * a.y * r - a.z * s,
        a.y * a.y * r + c,
        a.z * a.y * r + a.x * s,
        a.x * a.z * r + a.y * s,
        a.y * a.z * r - a.x * s,
        a.z * a.z * r + c
    );
    return m * p;
}


// Union
float opU(float d1, float d2)
{
    return min(d1, d2);
}
vec2 opU(vec2 d1, vec2 d2)
{
    if(d1.x < d2.x) return d1;
    return d2;
}

// Substraction
float opS(float d1, float d2)
{
    return max(d1, -d2);
}
vec2 opS(vec2 d1, vec2 d2)
{
    if(d1.x > -d2.x) return d1;
    return vec2(-d2.x, d2.y);
}

// Intersection
float opI(float d1, float d2)
{
    return max(d1, d2);
}

// Repetition
vec3 opRep(vec3 p, vec3 c)
{
    return mod(p, c) - 0.5 * c;
}
vec3 opRep(vec3 p, float c) { return opRep(p, vec3(c)); }

// 2d Rectangle
float dfRect(vec2 p, vec2 size)
{
    vec2 d = abs(p) - size;
    return min(max(d.x, d.y), 0.) + length(max(d, 0.));
}

// 3d Box
vec2 dfBox(vec3 p, vec3 size)
{
    vec3 d = abs(p) - size;
    return vec2(min(max(d.x, max(d.y, d.z)), .0) + length(max(d, .0)), M_BASE);
}

vec2 dfInfCross(vec3 p, float side)
{
    
    float pillarX = dfRect(p.xy, vec2(side));
    float pillarY = dfRect(p.yz, vec2(side));
    float pillarZ = dfRect(p.zx, vec2(side));
   /*
    vec2 pillarX = dfBox(p, vec3(INFINITY, side, side));
    vec2 pillarY = dfBox(p, vec3(side, INFINITY, side));
    vec2 pillarZ = dfBox(p, vec3(side, side, INFINITY));
   */
    return vec2(opU(pillarX, opU(pillarY, pillarZ)), M_CROSS);
}

float dfSphere(vec3 p, vec3 position, vec3 scale)
{
    float radius = 0.9;
    return length(p) - radius;
}

// menger sponge
vec2 distanceFunc(vec3 p)
{
// rotate check
#ifdef USE_ROTATE
    p = rotate(p, radians(time / PI * 100.), vec3(1., .5, -0.2));
#endif
    float size = 1.;
    float count = 1.;
    vec2 baseCube = dfBox(p, vec3(size));
    vec2 dist = baseCube;
    for(int i=0; i<4; i++)
    {
        // float repeatInterval = 1.25 - abs(pow(.7 * cos(time / PI), 2.) * 1.0);
        float repeatInterval = 1.25 - abs(.7 * cos(time / PI *.1));
        // float repeatInterval = 0.9999;
        vec3 a = opRep(p * count, repeatInterval);
        count *= 3.;
        vec3 r = 1. - 3. * abs(a);

        vec2 c = vec2(dfInfCross(r, size/3.).x / count, M_CROSS);
        dist = opS(dist, c);
    }
    return dist;
}

vec3 getNormal(vec3 p){
    float d = 0.0001;  // 法線を得るためにrayの始点をずらす量
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)).x - distanceFunc(p + vec3( -d, 0.0, 0.0)).x,
        distanceFunc(p + vec3(0.0,   d, 0.0)).x - distanceFunc(p + vec3(0.0,  -d, 0.0)).x,
        distanceFunc(p + vec3(0.0, 0.0,   d)).x - distanceFunc(p + vec3(0.0, 0.0,  -d)).x
    ));
}

float getSimpleLightingDiffuse(vec3 rPosition, vec3 lightPos)
{
    vec3 normal = getNormal(rPosition);
    return clamp(dot(lightPos, normal), 0.05, 1.0);
}

float getSoftShadow(vec3 rPosition, vec3 rDirection){
    float h = 0.0;
    float c = 0.001;
    float r = 1.0;
    float shadowCoef = 0.5;
    for(float t = 0.0; t < 60.0; t++){
        h = distanceFunc(rPosition + rDirection * c).x;
        if(h < 0.001){
            return shadowCoef;
        }
        r = min(r, h * 16.0 / c);
        c += h;
    }
    return 1.0 - shadowCoef + r * shadowCoef;
}

void main()
{
    // fragment position
    vec2 fPosition = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    
    float timeScale =  .1;
    // camera
#ifdef SCALE_ANIMATION
    float k = 9.;
    float animTime = mod(time, 3.);
    if(mod(floor(time / 3.), 2.) == 1.) animTime = 3. - animTime; 
    vec3 cPosition = vec3(0.0,  0.0,  2.) + vec3(fBm(vec2(cos(time / PI * timeScale), sin(time / PI * timeScale))) - .5, fBm(vec2(sin(time / PI * timeScale), cos(time / PI * timeScale))) - .5, mix(200., .0, 1.0 - exp( -animTime * k )));
#else
    vec3 cPosition = vec3(0.0,  0.0,  2.25) + vec3(fBm(vec2(cos(time / PI * timeScale), sin(time / PI * timeScale))) - .5, fBm(vec2(sin(time / PI * timeScale), cos(time / PI * timeScale))) - .5, -1.125 +1.125 * cos(-time*.2 * timeScale));
#endif
    vec3 cDirection = vec3(0.0,  0.0, -1.0);

    // light
    vec3 lPosition = vec3(0.577, 2., 1.577);
    
    // rayの方向ベクトル
    vec3 rDirection = getRayDirection(cPosition, cDirection, fPosition);
    
    // marching loop
    vec2 distance = vec2(0.); // rayとオブジェクト間の最短距離
    float rLength = 0.0;     // rayの長さ
    vec3  rPosition = cPosition;    // rayの先端位置
    float ittrCount = 0.;
    for(int i = 0; i < MAX_MARCHING_ITTRATION; i++) {
        distance = distanceFunc(rPosition);
        rLength += distance.x;
        rPosition = cPosition + rDirection * rLength;
        ittrCount++;
        if(abs(distance.x) < RAY_HIT_THRESHOLD) {
            break;
        }
    }
    
    // 衝突判定
    if(abs(distance.x) < RAY_HIT_THRESHOLD) {
        float diff = getSimpleLightingDiffuse(rPosition, lPosition);
        float shadow = getSoftShadow(rPosition + getNormal(rPosition) * 0.001, lPosition);
        vec3 color = distance.y == M_BASE ? vec3(.0) : vec3(.9, 1., .4);
        gl_FragColor = vec4(color * diff * max(.5, shadow) * (1. - ittrCount / float(MAX_MARCHING_ITTRATION)) + vec3(.9, 1., .4) * (ittrCount / float(MAX_MARCHING_ITTRATION)), 1.0);
    }else{
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}