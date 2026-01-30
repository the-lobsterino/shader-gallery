#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = acos(-1.);
const float PI2 = PI * 2.;

mat2 rot(float a){
    float c = cos(a),s = sin(a);
    return mat2(c,-s,s,c);
}

float rand(float n){
    return fract(sin(n)*943.321);
}


float sdBox(vec2 p,float s){
    float a = atan(p.y,p.y);
    return normalize(max(p.x,p.y)-s)*a;
}

vec2 pmod(vec2 p,float r){
    float a = atan(p.x,p.y)-PI/r;
    float n = PI2/r;
    a = floor(a/n)*n;
    return p*rot(-a);
}

float sp(vec2 p, float s){
    return length(p)-s;
}

vec3 hsv(vec3 c){
    vec4 t = vec4(1.0,2.0/3.0,1.0/3.0,3.0);
    vec3 p = abs(fract(vec3(c.x)-t.xyz)*6.0-vec3(t.w));
    return c.z * mix(vec3(t.x),clamp(p-vec3(t.x),0.0,1.0),c.y);
}

void main(void){
    vec2 p = (gl_FragCoord.xy*2.0-resolution)/min(resolution.x,resolution.y);
    p.xy *= 3.0*smoothstep(time,0.0,2.0);
    p.xy *= rot(time*8.0);
    p.xy *= mod(abs(p.xy),0.75);
    float d = sdBox(abs(p),0.5);
    vec3 col = vec3(0.8,0.125,0.125);
    gl_FragColor = vec4(hsv(vec3(d*col)*sin(time*1.0)*8.2),1.0);
}