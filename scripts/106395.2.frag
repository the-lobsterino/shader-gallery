
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(float x) { return fract(sin(x) * 458.5453123); }
float rand(vec2 co) { return fract(sin(dot(co.xy ,vec2(.9898,78.233))) * 43.5357); }
float rand(float x, float y) { return rand(vec2(x, y)); }

void main(){
vec2 p = ( gl_FragCoord.xy / resolution.xy )  ;
//p.x+=time*0.0009;
float tmp =  rand(p);
float rr = rand(tmp, 0.5) > (.90) ? 1. : 0.;
if(p.y<0.5)gl_FragColor = vec4(rr*0.1,rr*0.25,sin(rr*0.9),1.0 );
}