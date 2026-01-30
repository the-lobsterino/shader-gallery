precision mediump float; 
//head rotate(3d tst)

// Wouter van Nifterick: 
// Forked from http://glslsandbox.com/e#22371.0
// Added mouse-like shape, pointy hair, chewing motion and background

uniform vec2 resolution;
uniform vec4 mouse;
uniform float time;
const float pi = 3.141592653589793;

float smin(in float a, in float b, in float k) {
    float s = 0.5;	
    float h = clamp(s + s * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
}

float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
    vec3 pa = p - a, ba = b - a;
    float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
    return length(pa - h * ba) - r;
}

float map(in vec3 p) {
    float theta = sin(time);
    float c = cos(theta);
    float s = sin(theta);
    mat3 m = mat3(
        c, 0.0, s,
        0.0, 1.0, 0.0,
        -s, 0.0, c
        );
    p = m * p;
    float d1 = length(p) - 0.5;
    float f1 = 0.2 * sin(p.x * 100.0) * sin(p.y * 1.0) * sin(p.z * 1.0);
    float h = clamp((p.y - 0.30) / 0.25, 0.0, 1.0)*3. * sin(45.*p.z)*0.8;
    f1 = mix(0.0, f1, h);
    d1 += f1;
    float d2 = sdCapsule(p, vec3(0.0, 0.0, 0.0), vec3(0.0,-0.3+0.1*sin(14.*time)* -0.5, 0.51), 0.1);
    float d3 = length(p - vec3(-0.28, 0.1, 0.5)) - 0.15;
    float d4 = length(p - vec3(0.28, 0.1, 0.5)) - 0.15;
    float d5 = length(p - vec3(-0.22, 0.09, 0.39)) - 0.11;
    float d6 = length(p - vec3(0.22, 0.09, 0.39)) - 0.11;
    
    float d = smin(d1, d2, .55);
    d = max(d, -d3);
    d = max(d, -d4);
    d = min(d, d5);
    d = min(d, d6);
    return d;
}

vec3 calcNormal(in vec3 p) {
    vec2 e = vec2(-1.0, 1.0) * 0.01;
    return normalize(
            e.xyy * map(p + e.xyy) +
            e.yxy * map(p + e.yxy) +
            e.yyx * map(p + e.yyx) +
            e.xxx * map(p + e.xxx)
        );
}

void main() { 
    vec2 p = gl_FragCoord.xy / resolution;
    p = 2.0 * p - 1.0;
    p.x *= resolution.x / resolution.y;
    vec3 col = vec3(1.0);
    
    float persp=0.5;
    vec3 ro = vec3(0.0, 0.0, 2.0*persp+.2);
    vec3 rd = normalize(vec3(p, -2.0*persp));
    
    float t = 0.0;
    float h =0.001;
    float tmax = 2.0;
    for(int i = 0; i < 60; i++) {
        if(h < 0.001 || t > tmax) continue;
        h = map(ro + rd * t);
        t += h;
    }
    
    if(t < tmax) {
        vec3 pos = ro + rd * t;
        vec3 nor = calcNormal(pos);
        vec3 lig = normalize(vec3(1.0));
        float dif = clamp(dot(lig, nor), 0.0, 1.0);
        float spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 32.0);
        float fre = pow(clamp(1.0 + dot(rd, nor), 0.0, 1.0), 3.0);
        col *= (vec3(0.74, 0.66, 0.6) * dif + spe) * 0.9 + vec3(0.7, 0.2, .8) * fre * 0.5;
        col = 0.9 * col + 0.1;
    }
    else {
        col = vec3(0.3+p.y*.2,0.3+p.y*.2,0.4+p.y*.2);
    }
    
    gl_FragColor = vec4(col, 1.0);
}