#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
precision mediump float;
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

const int   oct  = 6;
const float per  = 0.7;
const float PI   = 3.1415926;
const float cCorners = 1.0 / 16.0;
const float cSides   = 1.0 / 8.0;
const float cCenter  = 1.0 / 4.0;

const float scalex = 100.0;
const float scaley = 100.0;
const vec2 offset = vec2(0.0,0.0);

// 線形補間
float interpolate(float a, float b, float x){
    float f = (1.0 - cos(x * PI)) * 0.5;
    return mix(a,b,f);
}

// 乱数生成
float rnd(vec2 p){
    return fract(sin(dot(p ,vec2(12.9898,78.233))) * 43758.5453);
}

// 補間乱数
float irnd(vec2 p){
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec4 v = vec4(rnd(vec2(i.x,       i.y      )),
                  rnd(vec2(i.x + 1.0, i.y      )),
                  rnd(vec2(i.x,       i.y + 1.0)),
                  rnd(vec2(i.x + 1.0, i.y + 1.0)));
    return interpolate(interpolate(v.x, v.y, f.x), interpolate(v.z, v.w, f.x), f.y);;
}

// ノイズ生成
float noise(vec2 p){
    float t = 0.0;
	float ampcnt = 0.0;
    for(int i = 0; i < oct; i++){
        float freq = pow(2.0, float(i+4));
        float amp  = pow(per, float(i+1));
        t = t + irnd(vec2(p.x / (resolution.x/ freq) / (scalex/100.0), p.y / (resolution.x / freq)/ (scaley/100.0))) * amp;
	ampcnt += amp;
    }
	t *= 1.0/ampcnt;
    return t;
}

// シームレスノイズ生成
float snoise(vec2 p, vec2 q, vec2 r){
    return noise(vec2(p.x,       p.y      )) *        q.x  *        q.y  +
           noise(vec2(p.x,       p.y + r.y)) *        q.x  * (1.0 - q.y) +
           noise(vec2(p.x + r.x, p.y      )) * (1.0 - q.x) *        q.y  +
           noise(vec2(p.x + r.x, p.y + r.y)) * (1.0 - q.x) * (1.0 - q.y);
}

void main(void){
    // noise
    vec2 t = gl_FragCoord.xy + offset + vec2(time * 10.0);
	t += noise(t + time) * 1000.0;
    float n = noise(t);
    
    // seamless noise
//	const float map = 256.0;
//	vec2 t = mod(gl_FragCoord.xy + vec2(time * 10.0), map);
//	float n = snoise(t, t / map, vec2(map));
    
    gl_FragColor = vec4(vec3(n), 1.0);
}