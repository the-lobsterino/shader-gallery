
//----------------------------------
// DoubleTorusKnot.glsl   2021-06-14
//----------------------------------
// http://glslsandbox.com/e#73448.2

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
uniform sampler2D backbuffer;

float pi = acos(-1.0);
float pi2 = pi * 2.0;

mat2 rotate(float a){
    float c = cos(a);
    float s = sin(a);
    return mat2(c, -s, s, c);
}

float sdBox2d(vec2 p, vec2 s){
    p = abs(p) - s;
    return length(max(p, 0.0))+min(max(p.x, p.y), 0.0);
}

float sdTorus(vec3 p, float inRadius, float outRadius){
    vec2 q = vec2(length(p.xz) - outRadius, p.y);
    return length(q) - inRadius;
}

float sdTorusKnots(vec3 p, float inRadius, float outRadius, 
		   float windings)
{   float a = atan(p.x, p.z);
    vec2 cp = vec2(length(p.xz) - outRadius, p.y)
              * rotate(a*windings*0.5);
    cp.y = abs(cp.y) - 0.5;
    return sdBox2d(cp, vec2(inRadius, inRadius*2.0));
}

float distanceFunc(vec3 p){
    p.xy *= rotate(time*.2);
    p.yz *= rotate(time*.3);
    p.xz *= rotate(time*.1);
    return sdTorusKnots(p, 0.15+mouse.y/7., 2.0, 10.0);
}

vec3 getNormal(vec3 p){
    vec2 err = vec2(0.1, 0.0);
    float d = distanceFunc(p);
    return normalize(
      vec3(d - distanceFunc(p - err.xyy),
           d - distanceFunc(p - err.yxy),
           d - distanceFunc(p - err.yyx)));
}

// https://www.youtube.com/watch?v=-FvnsYbzpfc
vec3 background(vec3 rayDir){

    vec3 bgColor = vec3(0.0);
    float k = rayDir.y * 0.5 + 0.5;
    bgColor += (1.0-k);


    return bgColor;
}

vec3 renderingFunc(vec2 uv){
    vec3 color = vec3(0.0);
    float t = time * 6.0;
    vec3 camPos = vec3(0.0, 0.0, -4.0);
    vec3 lookPos = vec3(0.0, 0.0, 0.0);
    vec3 forward = normalize(lookPos - camPos);
    vec3 up = vec3(0.0, 1.0, 0.0);
    vec3 right = normalize(cross(up, forward));
    up = normalize(cross(forward, right));
    vec3 rayDir = normalize(uv.x * right + uv.y * up + forward);
    
    vec3 p = camPos;
    float df = 0.0;
    float d = 0.0;
    for(int i = 0; i < 64; i++){
        df = distanceFunc(p);
        if(df > 100.0)  break;
        if(df <= 0.001) break;
        d += df;
        p = camPos + 0.5*rayDir * d;
    }
    if(df <= 0.001)
        rayDir = refract(rayDir, getNormal(p), 0.1);
    
    color = mix(color, background(rayDir), smoothstep(0.0, 4.0, d));
    return color;
}

void main(){
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
    vec3 color = vec3(0.0);
    color += renderingFunc(uv);
    gl_FragColor = vec4(color, 1.0);
}