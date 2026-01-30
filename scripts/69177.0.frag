precision highp float;
uniform vec2 resolution;
uniform float time;

#define OBJECT_SIZE 2.0
#define OBJECT_BASE (vec3(255, 0, 0) / 255.0 * 1.0)
#define LIGHT_INTENSITY 1.0
#define LIGHT_DISTANCE_ATTEN 0.15
#define LIGHT_COLOR (vec3(1, 0.9, 0.8) * LIGHT_INTENSITY) // 光の色
#define AMBIENT_COLOR (vec3(70,130,255) / 255.0 * 0.35)

// #define LIGHT normalize(vec3(0, 1, 1)) // 光源の向き
#define LIGHT normalize(vec3(cos(time), 1, sin(time))) // 光源の向き
#define WATER_COLOR vec3(0,0,1) // 水の色

// カメラ
#define CAMERA_TIME (time * PI / 2.0)
#define CAMERA_HEIGHT  (mix(15.0, 17.0, 0.5 + 0.5 * sin(CAMERA_TIME)))
#define CAMERA_RADIUS 34.0 
#define CAMARA_RADIAN radians(65.0)
// #define CAMERA_POS vec3(CAMERA_RADIUS * cos(CAMERA_TIME), CAMERA_HEIGHT, CAMERA_RADIUS * sin(CAMERA_TIME))
#define CAMERA_POS vec3(0.5 * cos(CAMERA_TIME) + CAMERA_RADIUS * cos(CAMARA_RADIAN), CAMERA_HEIGHT, CAMERA_RADIUS * sin(CAMARA_RADIAN))
#define CAMERA_LOOK vec3(0, 0, 0)

// フォグの開始距離
#define FOG_START 50.0
// フォグの増加量
#define FOG_SCALE 0.5 

// 波面へのトレーシングの設定
#define WAVE_TRACE_MIN_DISTANCE 0.01
#define WAVE_TRACE_LOOP 24

// コースティクス
#define CAUSTICS_INTENSIRTY 1.0 // コースティクス強度
#define CAUSTICS_EXPONENT 1.0 // コースティクス強度
#define CAUSTICS_ATTEN 0.01 // コースティクス減衰

//////////////////////////////////////////////////
// from : Seascape (ShaderToy)
// https://www.shadertoy.com/view/Ms2SD1
//////////////////////////////////////////////////
const int NUM_STEPS = 8;
const float PI	 	= 3.141592;
const float EPSILON	= 1e-3;
#define EPSILON_NRM (0.1 / iResolution.x)
#define AA

// sea
const int ITER_GEOMETRY = 3;
const int ITER_FRAGMENT = 5;
const float SEA_HEIGHT = 0.3;
const float SEA_CHOPPY = 4.0;
const float SEA_SPEED = 1.5;
const float SEA_FREQ = 0.45;
const vec3 SEA_BASE = vec3(0.0,0.09,0.18);
const vec3 SEA_WATER_COLOR = vec3(0.8,0.9,0.6)*0.6;
#define SEA_TIME (1.0 + time * SEA_SPEED)
const mat2 octave_m = mat2(1.6,1.2,-1.2,1.6);

float hash( vec2 p ) {
	float h = dot(p,vec2(127.1,311.7));	
    return fract(sin(h)*43758.5453123);
}
float noise( in vec2 p ) {
    vec2 i = floor( p );
    vec2 f = fract( p );	
	vec2 u = f*f*(3.0-2.0*f);
    return -1.0+2.0*mix( mix( hash( i + vec2(0.0,0.0) ), 
                     hash( i + vec2(1.0,0.0) ), u.x),
                mix( hash( i + vec2(0.0,1.0) ), 
                     hash( i + vec2(1.0,1.0) ), u.x), u.y);
}


// sea
float sea_octave(vec2 uv, float choppy) {
    uv += noise(uv);        
    vec2 wv = 1.0-abs(sin(uv));
    vec2 swv = abs(cos(uv));    
    wv = mix(wv,swv,wv);
    return pow(1.0-pow(wv.x * wv.y,0.65),choppy);
}

float map(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_GEOMETRY; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

float map_detailed(vec3 p) {
    float freq = SEA_FREQ;
    float amp = SEA_HEIGHT;
    float choppy = SEA_CHOPPY;
    vec2 uv = p.xz; uv.x *= 0.75;
    
    float d, h = 0.0;    
    for(int i = 0; i < ITER_FRAGMENT; i++) {        
    	d = sea_octave((uv+SEA_TIME)*freq,choppy);
    	d += sea_octave((uv-SEA_TIME)*freq,choppy);
        h += d * amp;        
    	uv *= octave_m; freq *= 1.9; amp *= 0.22;
        choppy = mix(choppy,1.0,0.2);
    }
    return p.y - h;
}

// tracing
vec3 getNormal(vec3 p, float eps) {
    vec3 n;
    n.y = map_detailed(p);    
    n.x = map_detailed(vec3(p.x+eps,p.y,p.z)) - n.y;
    n.z = map_detailed(vec3(p.x,p.y,p.z+eps)) - n.y;
    n.y = eps;
    return normalize(n);
}

float heightMapTracing(vec3 ori, vec3 dir, out vec3 p) {  
    float tm = 0.0;
    float tx = 1000.0;    
    float hx = map(ori + dir * tx);
    if(hx > 0.0) return tx;   
    float hm = map(ori + dir * tm);    
    float tmid = 0.0;
    for(int i = 0; i < NUM_STEPS; i++) {
        tmid = mix(tm,tx, hm/(hm-hx));                   
        p = ori + dir * tmid;                   
    	float hmid = map(p);
		if(hmid < 0.0) {
        	tx = tmid;
            hx = hmid;
        } else {
            tm = tmid;
            hm = hmid;
        }
    }
    return tmid;
}

// フォグの取得
float getFog(float depth)
{
    float fogZ = max(0.0, depth - FOG_START);
    float fog = 1.0 - exp(-fogZ * FOG_SCALE);

    return fog;
}

// 点pからオブジェクトまでの距離
float sdf(vec3 p)
{
    float size = OBJECT_SIZE;
    vec3 center = vec3(0, OBJECT_SIZE, 0);
    return length(p - center) - size;
}

// オブジェクトへのトレーシングを行う
// r0 : Rayの開始位置
// rd : Rayの向き
void traceObject(vec3 r0, vec3 rd, out float isHit, out float dist)
{
    for (int i = 0; i < 10; i++)
    {
        float d = sdf(r0 + rd * dist);
        if (d < 0.01)
        {
            isHit = 1.0;
            break;
        }
        dist += d;
    }
}

// 地面へのトレーシングを行う
// r0 : Rayの開始位置
// rd : Rayの向き
void traceGround(vec3 r0, vec3 rd, out float isHit, out float dist)
{
    if (rd.y > 0.0) // Rayが上向きの場合は地面に当たらない
    {
        dist = 99999.0;
        return;
    }

    isHit = 1.0;
    dist = r0.y / -rd.y; 
}

// オブジェクトの法線取得
vec3 getNormalObject(vec3 p)
{
    vec2 d = vec2(0.001, 0); 

    return normalize(vec3(
        sdf(p + d.xyy) - sdf(p - d.xyy),
        sdf(p + d.yxy) - sdf(p - d.yxy),
        sdf(p + d.yyx) - sdf(p - d.yyx)
    ));
}

// オブジェクトの色の計算を行う
// ray : Rayのヒット位置
// v : 視線ベクトル
// n : 法線ベクトル
// l : 光線ベクトル
vec3 renderObject(vec3 ray, vec3 v, vec3 n, vec3 l)
{
    vec3 r = reflect(l, n); // 光の反射ベクトル
    vec3 h = normalize(l + v); // ハーフベクトル
    float nDorL = clamp(dot(n, l), 0.0, 1.0);
    float vDotR = clamp(dot(v, r), 0.0, 1.0);
    float nDotH = clamp(dot(n, h), 0.0, 1.0);
    float glossVDotR = 100.0; // 光沢度
    float glossNDotH = 1.0; // 光沢度
    float factorNDotL = 1.0; // nDotによる反射強度(拡散反射強度)
    float factorVDotR = 1.0; // vDotRによる反射強度(Phong鏡面反射強度)
    float factorNDotH = 0.2; // nDotHによる反射強度(Blinn-Phong鏡面反射強度)

    vec3 col = 
        + nDorL * OBJECT_BASE * factorNDotL * LIGHT_COLOR // 拡散反射
        // + pow(vDotR, glossVDotR) * factorVDotR * LIGHT_COLOR // 鏡面反射 (Phong)
        // + pow(nDotH, glossNDotH) * factorNDotH * LIGHT_COLOR // 鏡面反射 (Bling-Phong)
        ;

    return col + AMBIENT_COLOR;
}

float isShadow(vec3 p, vec3 light)
{
    // trace shadow
    float isShadow;
    float shadowDist;
    traceObject(p, light, isShadow, shadowDist);

    return isShadow;    
}

#define GROUND_BASE vec3(0.9, 0.9, 0.85)
#define GROUND_LINE vec3(0.1)
#define LINE_SIZE 0.05
#define GROUND_UV_SCALE 1.0
vec3 renderGround(vec3 ray, vec3 light)
{
    float lineSize = 0.05;
    vec2 groundUV = fract(ray.xz * GROUND_UV_SCALE);
    float grid = max(step(groundUV.x, lineSize), step(groundUV.y, lineSize));
    vec3 groundBase = mix(GROUND_BASE, GROUND_LINE, grid);
    vec3 groundColor = groundBase * (AMBIENT_COLOR + LIGHT_COLOR);

    return groundColor;
}

// コースティクス用のライトマップ
// rd : 屈折rayの向き
float getCausticsMap(vec3 rd, vec3 light)
{
    float map = clamp(dot(rd, light), 0.0, 1.0);
    // map = pow(map, CAUSTICS_EXPONENT);
    return map;
}

// コースティクス計算用の後方レイトレーシング
// Rayを真上に飛ばし、屈折したRayと光源の向きを利用してコースティクスを計算する
// r0 : Rayの開始位置
// rd : Rayの向き
vec3 renderCaustics(vec3 r0, vec3 rd)
{
    if(rd.y < 0.1) return vec3(0);
    // vec3 rd = vec3(0, 1, 0); // 海底から飛ばすRayの向き

    // vec3 hit = sd
    // float waveHeight = getWaveHeight(r0, WAVE_TIME);
    float waveHeight = map_detailed(r0);

    // Rayを水面位置まで飛ばす
    vec3 waterRay;
    heightMapTracing(r0 + rd / rd.y * 30.0, -rd, waterRay);

    float depth = length(waterRay - r0); // Rayが水中を進んだ距離
    float atten = exp(-depth * depth * CAUSTICS_ATTEN);
    r0 = waterRay;

    // 水面の法線の取得
    vec3 waveNormal = getNormal(r0, 0.01);

    // Rayを水面で屈折させる
    vec3 r = refract(rd, waveNormal, 1.0 / 1.333);

    // コースティクスの計算
    float caustics = getCausticsMap(r, LIGHT) * CAUSTICS_INTENSIRTY ;
    

    return caustics * LIGHT_COLOR;
}


void main()
{
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    // vec3 cPos = vec3(2, 12, -24);
    vec3 cPos = CAMERA_POS;
    // vec3 cDir = normalize(vec3(0,-1, 1));
    vec3 cDir = normalize(CAMERA_LOOK - cPos);
    vec3 cUp = normalize(vec3(0,1,0));
    vec3 cSide = normalize(cross(cUp, cDir));
    float focus = 12.0;

    vec3 rd = normalize(p.x * cSide + p.y * cUp + cDir * focus);

    cPos += cUp * 1.9;

    // trace object
    float isHitObject;
    float objectDist;
    traceObject(cPos, rd, isHitObject, objectDist);
    vec3 objectRay = cPos + rd * objectDist;
    vec3 objectNormal = getNormalObject(objectRay); // オブジェクト表面の法線

    // trace ground 
    float isHitGround;
    float groundDist;
    traceGround(cPos, rd, isHitGround, groundDist);
    vec3 groundRay = cPos + rd * groundDist;
    vec3 groundNormal = vec3(0,1,0); // 地面の法線

    // depth test
    float sceneDepth = mix(groundDist, objectDist, isHitObject);
    vec3 sceneNormal = mix(groundNormal, objectNormal, isHitObject);
    vec3 sceneRay = cPos + sceneDepth * rd;

    // rendering
    vec3 objectColor = renderObject(objectRay, rd, objectNormal, LIGHT);
    vec3 groundColor = renderGround(groundRay, LIGHT);
    vec3 caustics = renderCaustics(sceneRay, sceneNormal);

    vec3 col = groundColor * isHitGround;
    col = mix(col, objectColor, isHitObject);

    col = mix(col, WATER_COLOR, 0.7);

    gl_FragColor = vec4(col + caustics, 1);
}