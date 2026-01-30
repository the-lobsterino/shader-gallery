#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2  resolution;     // resolution (width, height)
uniform vec2  mouse;          // mouse      (0.0 ~ 1.0)
uniform float time;           // time       (1second == 1.0)
uniform sampler2D backbuffer; // previous scene

const float PI = 3.1415926;

float box(vec3 p,vec3 s){
    vec3 d = abs(p) - s;
    return length(max(d,0.0));
}

vec2 rot(vec2 p, float a){
    float c= cos(a),s = sin(a);
    return p * mat2(c,s,-s,c);
}

vec2 pmod(vec2 p,float n){
    float a = atan(p.x,p.y) + PI / n;
    float r = 2.0 *PI / n ;
    a = floor(a / r) * r;
    return rot(p,-a);
}

vec3 pmod3(vec3 p, float n){
    float r = length(p);
    float th = acos(p.z/r) + PI / n;
    float ph = sign(p.y) * acos(p.x/length(p.xy)) + PI / n;
    vec2 a = vec2(th,ph);
    float ps = 2.0 * PI / n;
    a = floor(a / ps) * ps;
    p.xy = rot(p.xy,-a.y);
    p.yz = rot(p.yz,-a.x);
    return p;
}

vec3 rep(vec3 p ,vec3 s){
    return mod(p,s) - s * 0.5;
}

float map(vec3 p){
    //p.z -= 5.0;
    p = pmod3(p, 8.);
    //p.y -= 5.;
    p.xy = rep(p,vec3(10.0)).xy;
    p.z = abs(p.z);
    p.z -= 3.0;
    p.z = rep(p,vec3(3.0)).z;
    p.x = abs(p.x);
    p.xy = rot(p.xy,PI / 4.0);
    p.x -= 2.0;
    p.xy = pmod(p.xy, 6.0);
    p.y -= 4.0;
    p *= 1.2;
    float d = box(p,vec3(1.0));
    vec3 q = p;
    q.xy -=2.0;
    q.yz = pmod(q.yz,8.);
    float s =length(q) - .5;
    return d;
}

vec3 normal(vec3 p,float e){
    vec2 d = vec2(e,0.0);
    return normalize(vec3(map(p + d.xyy) - map(p - d.xyy),map(p + d.yxy) - map(p - d.yxy),map(p + d.yyx) - map(p - d.yyx)));
}

void main(){
    vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x,resolution.y);
    float depth = 1.0;
    vec3 ro = vec3(0,0,0);
    vec3 rd = vec3(p,depth);
    rd = normalize(rd);
    rd.xz = rot(rd.xz,time * 0.1);
    vec2 of =vec2(1.0,0.0);
    of = rot(of,time);
    ro.xy += of;
    float a = atan(ro.y,ro.z);
    //rd.yz = rot(rd.yz,-a);
    float t = 0.;
    vec3 col = vec3(0.0);
    vec3 pos = vec3(999.);
    
    for(int i = 0; i < 128;i++){
        t = map(ro);
        if(t < 0.001)break;
        ro += t * rd;
    }
    
    if(t < 0.001){
        pos = ro + rd * t;
        vec3 n = normal(pos,0.001);
        vec3 lp = vec3(0.);
        vec3 ld = lp-pos;
        float ndotl = max(dot(n,ld),0.0);
        col = vec3(ndotl/length(ld));
        //col = vec3(1.0);
    }
    
    vec3 fc = vec3(1.);
    col = mix(col,fc,length(pos - ro)/1000.);
    gl_FragColor = vec4(col, 1.0);
}