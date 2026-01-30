#ifdef GL_ES
precision mediump float;
#endif

# extension GL_OES_standard_derivatives: enable
#define pi 3.14159265
const float angle = 60.0;
const float fov = angle * 0.5 * pi / 180.0;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 light;

float perlin(vec3 p) {
    vec3 i = floor(p);
    vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
    vec3 f = cos((p - i) * pi) * (-.5) + .5;
    a = mix(sin(cos(a) * a), sin(cos(1. + a) * (1. + a)), f.x);
    a.xy = mix(a.xz, a.yw, f.y);
    return mix(a.x, a.y, f.z);
}

vec3 hsv(float h, float s, float v) {
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

vec3 trans(vec3 p){
    return mod(p, 6.0) - 3.0;
}

float distanceCube(vec3 p){
    vec3 q = abs(trans(p));
    return length(max(q - vec3(0.5, 0.5, 0.5), 0.0)) - 0.1;
}

float distFuncFloor(vec3 p){
    return dot(p, vec3(0.0, 1.0, 0.0)) + 1.0;
}

float distanceFunc(vec3 p) {
 float d1 = length(trans(p)) - (0.7 + 0.5 * perlin(trans(p) * 5.0 + time * 2.0) * 0.1);
    float d2 = distFuncFloor(p);
    return min(d1, d2);
	
    //return length(p) - (0.7 + 0.5 * perlin(p * 5.0 + time * 2.0) * 0.1);
}

vec3 getNormal(vec3 p){
    float d = 0.0001;
    return normalize(vec3(
        distanceFunc(p + vec3(  d, 0.0, 0.0)) - distanceFunc(p + vec3( -d, 0.0, 0.0)),
        distanceFunc(p + vec3(0.0,   d, 0.0)) - distanceFunc(p + vec3(0.0,  -d, 0.0)),
        distanceFunc(p + vec3(0.0, 0.0,   d)) - distanceFunc(p + vec3(0.0, 0.0,  -d))
    ));
}

void main(void) {

    // fragment position
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

    // camera
    vec3 cPos = vec3(mouse.x-0.5, mouse.y-0.5, 2.0 + time * 10.0);
    vec3 cDir = vec3(0.0, 0.0, -1.0);
    vec3 cUp = vec3(0.0, 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;

    // ray
    // vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);
    vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
	
	light=vec3(2.0*sin(time*1.0),cPos.y,cPos.z);
	

    // marching loop
    float distance = 0.0; // レイとオブジェクト間の最短距離
    float rLen = 0.0; // レイに継ぎ足す長さ
    vec3 rPos = cPos; // レイの先端位置
    for (int i = 0; i < 100; i++) {
        distance = distanceFunc(rPos);
        rLen += distance;
        rPos = cPos + ray * rLen;
    }

    // hit check
    if (abs(distance) < 0.001) {
	    vec3 normal = getNormal(rPos);
	    float diff = clamp(dot(normalize(light), normal), 0.1, 1.0);
	   // gl_FragColor = vec4(vec3(diff), 1.0);
        gl_FragColor = vec4(hsv(diff, 0.8, 0.7*diff+0.3), 1.0);
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}