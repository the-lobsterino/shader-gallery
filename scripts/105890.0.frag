#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float kset(vec3 p) {
	    p = abs(.5 - fract(p * 80.));
    float es, l = es = 0.;
    for (int i = 0; i < 6; i++) {
        float pl = l;
        l = length(p);
        p = abs(p) / dot(p, p) - .5;
        es += exp(-1. / abs(l - pl));
    }
    return es;
}


void main( void ) {
vec2 uv = (gl_FragCoord.xy / resolution.xy)  * 0.1;
uv*=vec2(1.,uv.y*1.);
uv.x+=time*0.01;
float k= kset(vec3(uv.x,uv.y,.2)) *0.18;
vec3 col = mix(vec3(k * 1.1, k * k * 1.3, k * k * k), vec3(k), .45) ;
if(uv.y<0.0005) gl_FragColor = vec4(4.*col,1.0);
}
