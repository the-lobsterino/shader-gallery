// Necip's transfer from https://glslfan.com/?channel=-M-OwBUHNfcMumd5Z7UZ

// - glslfan.com --------------------------------------------------------------
// Ctrl + s or Command + s: compile shader
// Ctrl + m or Command + m: toggle visibility for codepane
// ----------------------------------------------------------------------------
precision mediump float;
uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

const float PI = 3.1415926;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

float dist(vec3 p){
    float d1 = 1.0-1.0/length(p);
    float d2 = 1.0-1.0/length(p-vec3(sin(time)*1.9,0.0,0.0));
    return d1+d2;
}
vec3 getnormal(vec3 p){
    vec2 e =vec2(0.00001,0.0);
    return normalize(vec3(
        dist(p+e.xyy)-dist(p-e.xyy),
        dist(p+e.yxy)-dist(p-e.yxy),
        dist(p+e.yyx)-dist(p-e.yyx)
    ));
}
vec4 lighting(vec3 p){
    vec3 normal = getnormal(p);
    vec3 lightdir = normalize(vec3(0.5,0.5,1.0));
    float NdotL = max(dot(lightdir,normal),0.0);
    vec3 col = vec3(NdotL);
    return vec4(col,1.0);
}
void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.yy;
    vec3 ro = vec3(0.0,0.0,5.0);
    vec3 ta = vec3(0.0,0.0,0.0);
    vec3 cdir = normalize(ta-ro);
    vec3 up = normalize(vec3(0.0,1.0,0.0));
    vec3 side = cross(cdir,up);
    up = cross(side,cdir);
    float fov = 3.0;
    vec3 rd = normalize(up*p.y+side*p.x+cdir*fov);
    float t = 0.00001;
    float d =0.0;
    for(int i =0;i<59;i++){
        d = dist(ro+rd*t);
        t +=d;
    }
    vec4 col = lighting(ro+rd*t);
    gl_FragColor = col;
}
