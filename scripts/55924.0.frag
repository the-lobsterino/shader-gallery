#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = acos(-1.);
const float pi2 = 2.*pi;

float boxf(vec3 p, vec3 b){
    return length(max(abs(p)-b, 0.));
}

mat2 rot(float a){
    float c = cos(a), s = sin(a);
    return mat2(c,s,-s,c);
}

vec2 pmod(vec2 p, float r){
    float a = atan(p.x, p.y) + pi/r;
    float n = pi2/r;
    a = floor(a/n)*n;
    return p*rot(-a);
}

float map(vec3 p){
    float scale = 2.;
    float d = 1e5, sum = scale;
    for(int i = 0; i < 5; i++){
        float td = boxf(p, vec3(.5))/sum;
        p = abs(p) - vec3(cos(time), 1.4*sin(atan(time)), 0);
        p.xy = pmod(p.xy, 6.);
        //p.yz = pmod(p.yz, 6.);
        p -= vec3(0, 2, 0);
        d = min(td, d);
        p.xy *= rot(pi*.25);
        p *= scale;
        sum *= scale;
    }
    return d;
}

void main(void){
    vec2 p = (gl_FragCoord.xy*2. - resolution.xy)/min(resolution.x, resolution.y);
    vec3 ro = vec3(0, 0, -7.);
    float screenz = 2.5;
    vec3 rd = normalize(vec3(p, screenz));
    float d = 0.;
    vec3 col = vec3(0.);
    for(int i = 0; i < 99; i++){
        vec3 pos = ro + rd*d;
        pos.xz *= rot(time*pi*.15);
        pos.yz *= rot(time*pi*.15);
        float dis = map(pos);
        if(dis < 0.00001){
            //col = vec3(1. - float(i)*.002);
            col = vec3(pos.x, pos.y, 1.);
            break;
        }
        d += dis;
    }
    gl_FragColor = vec4(col, 1.);
}