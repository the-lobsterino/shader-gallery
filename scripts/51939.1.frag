
precision highp float;


uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define PI 3.14159265359
const int   oct  = 8;
const float per  = 0.5;
const vec3 ringColor = vec3(0.7, 0.7, 0.7);
const vec3 sphereColor = vec3(1.0, 1.0, .0);
const vec3 redColor = vec3(1.0, 0.3, 0.2);
const vec3 blueColor = vec3(0.0, 0.5, 1.0);
const vec3 goldColor = vec3(1.0, 1.0, 1.0);

// methods
float random(in vec2 st);
float noise(in vec2 st);
float perlin(vec3 p);
vec2 foldX(vec2 p);
vec3 twist(vec3 p, float power);
float smoothMin(float d1, float d2, float k);
vec3 rotate(vec3 p, float angle, vec3 axis);
mat2 rotate(in float a);
vec2 Repeat(vec2 p, float loop);
vec3 Repeat(vec3 p, vec3 loop);
mat2 r2(float r);
vec2 foldRotate(in vec2 p, in float s);
float bar(vec2 p, float width, float interval);
float tube(vec2 p, float interval, float width);
float sphere(vec3 p, float size);
float crossBar(vec3 p);
float around(vec3 p);
float hexagontal(vec3 p, vec2 size);

struct Object {
    float dist;
    vec3 color;
};


float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

float noise (in vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);


    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f*f*(3.0-2.0*f);
   
    return mix(a, b, u.x) +
            (c - a)* u.y * (1.0 - u.x) +
            (d - b) * u.x * u.y;
}

float perlin(vec3 p) {
    vec3 i = floor(p);
    vec4 a = dot(i, vec3(1., 57., 21.)) + vec4(0., 57., 21., 78.);
	vec3 f = cos((p-i)*PI)*(-.5)+.5;
    a = mix(sin(cos(a)*a),sin(cos(1.+a)*(1.+a)), f.x);
	a.xy = mix(a.xz, a.yw, f.y);
    return mix(a.x, a.y, f.z);
}

vec2 foldX(vec2 p){
    p.x = abs(p.x);
    return p;
}

vec3 twist(vec3 p, float power){
    float s = sin(power * p.y);
    float c = cos(power * p.y);
    mat3 m = mat3(
          c, 0.0,  -s,
        0.0, 1.0, 0.0,
          s, 0.0,   c
    );
    return m * p;
}

float smoothMin(float d1, float d2, float k){
    float h = exp(-k * d1) + exp(-k * d2);
    return -log(h) / k;
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

mat2 rotate(in float a){
    float s = sin(a), c = cos(a);
    return mat2(c, s, -s, c);
}

vec2 Repeat(vec2 p, float loop){
    return mod(p, loop) - loop * 0.5;
}

vec3 Repeat(vec3 p, vec3 loop){
    return mod(p, loop) - loop * 0.5;
}

vec2 foldRotate(in vec2 p, in float s){
    float a = PI / s - atan(p.x, p.y);
    float n = 2.0*PI / s;
    a = floor(a / n) * n;
    p *= rotate(a);
    return p;
}

float bar(vec2 p, float interval, float width){
    return length(max(abs(Repeat(p, interval)) - width, 0.0));
}

float tube(vec2 p, float interval, float width){
    return length(Repeat(p, interval)) - width;
}

float sphere(vec3 p, float size) {
    return length(p) - size;
}

float crossBar(vec3 p){
    float bar_x = bar(p.yz, 1., .1);
    float bar_y = bar(p.xz, 1., .1);
    float bar_z = bar(p.xy, 1., .1);

    float tube_x = tube(p.yz, .1, 0.025);
    float tube_y = tube(p.xz, .1, 0.025);
    float tube_z = tube(p.xy, .1, 0.025);
	
    return max(max(max(min(min(bar_x, bar_y), bar_z), -tube_x),-tube_y),-tube_z);
}

float around(vec3 p){
    vec3 q = Repeat(p, vec3(4.0));
    float barDist = crossBar(q);

    return barDist;
}

float hexagontal(vec3 p, vec2 size) {
    vec3 q = abs(p);
    vec2 h = vec2(size.x, size.y);
    return max(q.z - h.y, max((q.x*0.866025+q.y*0.5), q.y)-h.x);
}

Object distanceFunc(vec3 p) {
    Object o;

    vec3 q = p;
    // sphere and hex
    float sp = sphere(p, 0.25);
    q = rotate(q, time, vec3(1.0, 0.8, 0.5));
    float hex = hexagontal(q, vec2(0.2, 0.2));
    float sphex = max(hex, -sp);
    vec3 spHexColor = vec3(1.0, .7, .3);
	
    vec2 foldP = foldRotate(twist(p, .4).xy, 10.0);
    float around = around(vec3(foldP, p.z) + vec3(0.0, 0.0, -time*2.0));
    o.dist = min(around, sphex);
    vec3 aroundColor = vec3(0.1, 0.4, 0.5) + (1.5-smoothstep(mod(time+p.z*0.05, 2.0), 1.80, 1.90)*1.5)*vec3(0.4, 1.0, 0.7);
    o.color = sphex < around ? spHexColor : aroundColor;

    return o;
}

vec3 genNormal(vec3 p) {
    float d = 0.001;
    return normalize(vec3(
        distanceFunc(p + vec3(d, 0.0, 0.0)).dist - distanceFunc(p + vec3(-d, 0.0, 0.0)).dist,
        distanceFunc(p + vec3(0.0, d, 0.0)).dist - distanceFunc(p + vec3(0.0, -d, 0.0)).dist,
        distanceFunc(p + vec3(0.0, 0.0, d)).dist - distanceFunc(p + vec3(0.0, 0.0, -d)).dist
        ));
}

void main() {
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 cPos = vec3(sin(time*0.1), 0.0, cos(time*0.5)); 
    vec3 cDir = normalize(-cPos);
    vec3 cUp = vec3(0.0, 1.0, 0.0);
    vec3 cSide = cross(cDir, cUp);
    float targetDepth = 1.0;

    vec3 ray = normalize(cSide * p.x + cUp * p.y + cDir * targetDepth);

    Object object;
    object.dist = 0.0;
    float rLen = 0.0;
    vec3 rPos = cPos;
    for(int i=0; i<64; i++) {
        object = distanceFunc(rPos);
        rLen += object.dist;
        rPos = cPos + ray * rLen;
    }

    if(abs(object.dist) < 0.001) {
        vec3 normal = genNormal(rPos);
        vec3 light = normalize(vec3(cPos)+vec3(0.0, 2.0, 0.0));
        float diff = max(dot(normal, light),0.3);
        float specular = pow(diff, 20.0);
        vec4 destColor = vec4(object.color*0.3+object.color*diff+vec3(specular),1.0);
        gl_FragColor = destColor;
    } else {
        gl_FragColor = vec4(vec3(0.0), 1.0);
    }
}
