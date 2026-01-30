/*
original code: https://www.shadertoy.com/view/XtySWy
Spirals all the way down
note: no mouse.zw in glslsandbox
*/

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec4 mouse;
uniform vec2 resolution;



#define iResolution resolution   
#define iGlobalTime time
#define iMouse mouse  

#define PI acos(-1.0)
#define R .3
#define S .2
#define its 5

vec3 color;

float DE(vec3 p) {
    float which0;
    for (int i = 0; i < its; ++i) {
        float r = length(p.xy)-1.;
        float a = atan(p.y, p.x)/PI + fract((sqrt(float(i)+1.)-1.)*iGlobalTime/3.)*2.;
        float t = p.z/(R*2.)-a+.5;
        float z = floor(t)+a;
        p = vec3(r,p.z-z*R*2., z)/S;
        float which = step(.5, fract(t*.5));
        if (i == 0) {
            which0 = which;
            color += vec3(1, 1, 1) * step(.95, fract(p.z/100.+which*.5-iGlobalTime/6.));
        } else if (i == 1) {
            color -= vec3(0,.5,.5)*which;
            color.y = step(.5, fract(p.z/1.+iGlobalTime)) * (1.-which0);
        } else if (i == 2) {
            color -= vec3(.5,0,.5)*which*(1.-which0);
        } else if (i == 3) {
            color -= vec3(1,1,0)*which;
        } else if (i == 4) {
           color *= 1.+.5*which;
        }
    }
    if (which0 > .5)
        color = color.yzx;
    return (length(p.xy)-1.)*pow(S,float(its));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord ) {
	vec2 uv = (fragCoord.xy - iResolution.xy*.5) / iResolution.y;
    vec3 origin;
    if (iMouse.z <= 0.)
        origin = vec3(vec2(cos(iGlobalTime*1.1),sin(iGlobalTime*1.7)) * .4, fract(iGlobalTime/60.)*60.*2.);
    else
        origin = vec3((iMouse.xy-iMouse.zw) / iResolution.xy * 2., 0.);
    float unit_pixsize = 1./(iResolution.x+iResolution.y);

    vec3 direction = normalize(vec3(uv, 1));
    
    const float diameter = 1000.;
    const int maxit = 50;
    
    vec3 p = origin;
    int it = maxit;
    for (int i = 1; i <= maxit; ++i) {
        if (length(p - origin) > diameter) {
            color = vec3(1,1,1);
            it = i;
            break;
        }
        color = vec3(1,1,1);
        float d = DE(p);
        float pixsize = unit_pixsize * distance(p, origin);
        if (d < pixsize*.1) {
            it = i;
            break;
        }
        p += direction * d;
    }

    float t = 1. - float(it) / float(maxit);
    fragColor = vec4(color*t,1.0);
}

void main(){mainImage(gl_FragColor,gl_FragCoord.xy);}  