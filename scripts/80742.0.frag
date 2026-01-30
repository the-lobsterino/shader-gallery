
#extension GL_OES_standard_derivatives : enable
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
uniform vec3 spectrum;

uniform sampler2D texture0;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D prevFrame;
uniform sampler2D prevPass;

varying vec3 v_normal;
varying vec2 v_texcoord;

#extension GL_OES_standard_derivatives : enable

precision highp float;


#define rot(a) mat2(cos(a), sin(a), -sin(a), cos(a))

float sdSphere(vec3 p, float r){
    return length(p) - r;
}

float sdBox(vec3 p, vec3 b){
    p = abs(p) - b;
    return length(max(p, 0.)) + min(max(max(p.x, p.y), p.z), 0.);
}

float map(vec3 p){
    p.xy *= rot(time);
    p.xz *= rot(time);
    
    vec3 size = vec3(.03, 5, .03);
    
    float d = 500.;
    
    p = abs(p) - 1.;
    
    for(int i = 0; i < 10; i++){        
        p.xy *= rot(time * .1);
        p.xz *= rot(time * .1);
        float d2 = sdBox(p, size);
        p.yz += sin(time * .6) * .8;
        d = min(d, d2);
    }
    
    return d;
}

void main( void ) {

    vec2 p = ( gl_FragCoord.xy / resolution.xy );
    p = (p - .5) * 8.;
    p.y *= resolution.y/resolution.x;

    vec3 col = vec3(0.);
    //col.xy = p;

    vec3 cp = vec3(-1., .56, p.x-1.);
    vec3 rd = normalize(vec3(p, 1.));
    
    float d, dd;
    int k;
    
    float max_dist = 60.;
    
    for(int i = 0; i < 60; i++){
        dd = map(cp + d * rd);
        if ( dd < 0.095){
            col /= 1.5;
            break;
        }
        if(d > max_dist) break;
        k = i;
        d += dd;
    }
    
    if(dd < 0.01){
        col += 1. - float(k) / 22.;
    }else{
        col += 1. -0.9;
        col *= mix(vec3(d-22.3, .19 * cos(time), 1.), vec3(-d/.29, -.2 * sin(time), 1.1), mod(-d, 12.));
    }
    
    
    gl_FragColor = vec4(col, 1.);
}