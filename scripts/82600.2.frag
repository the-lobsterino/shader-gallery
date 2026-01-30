//https://www.shadertoy.com/view/NsyBWG

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//0: torus, 1:sphere
#define PID 1

const float PI = 3.14159;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

mat3 setCamera(vec3 ro, vec3 tg, float cr){
	vec3 cw = normalize(tg-ro);
	vec3 cu = normalize(cross(cw,vec3(sin(cr), cos(cr), 0.0)));
	vec3 cv = cross(cu,cw);
    return mat3(cu, cv, cw);
}

mat2 rotate2D(float r){
    float c = cos(r);
    float s = sin(r);
    return mat2(c, s, -s, c);
}


void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = 2.0 * (fragCoord.xy - 0.5 * resolution.xy) / min(resolution.y, resolution.x);

    vec3 col = vec3(0);
    
    float t = time*0.125;
    
    vec3 ro = vec3(0, 0, -1);
    vec3 tg = vec3(0);

    mat3 ca = setCamera(ro, tg, 0.);
    vec3 rd = ca * normalize(vec3(uv, 1.));

    vec3 p,q;
    float td=.1, d;

    for(int i=0;i<32;++i){
        p = ro + td * rd;
        p.z+=t;
        for(int i=0;i<4;++i){
            p=abs(p)-.3;
            p.yz*=rotate2D(PI*.5);
            p.xz*=rotate2D(PI*.25);
        }
        q=mod(abs(p-.5),1.)-.5;
        #if PID == 0
        d = abs(length(vec2(length(q.xz) - 1., q.y)) - .9);
        #else
        d = abs(length(q) - .65);
        #endif
        if(d < 0.01){
            col += hsv(sin(q.x*q.y*8.+t), .8, .02/abs(sin(atan(q.x, q.z)*2.+t)*sin(atan(q.y, q.z)*2.+t)+.1));
            d+=0.001;
        }
        td += d;
    }
    fragColor = vec4(col,1.0);
}

void main(){
mainImage(gl_FragColor,gl_FragCoord.xy);
}