#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

vec2  c1 = vec2(0.0, 0.0), c2  = vec2(0.3, 0.4);
float r1 = 0.8           , r2  = 0.45;
float b1 = 0.2           , b2  = 0.1;
float bb = 0.01;

vec4  dark = vec4(0.2, 0.2, 0.5, 1.0);
vec4  light = vec4(1.0, 0.8, 1.0, 1.0);


float circle(vec2 p, vec2 c, float r, float b, float bb){
 float 	t = abs(distance(p,c*sin(time)));
        t = 1. - smoothstep(r - b, r - b + bb, t) + smoothstep(r - bb, r, t);
 return t;
}

void main( void ) {
 vec2  p = (gl_FragCoord.xy * 2.0 - resolution) /min(resolution.x,resolution.y);
 float i1 = circle(p,c1,r1,b1,bb);
 i1 += circle(p,c2,r2,b2,bb);
 float i = sin(i1+i1); 

 gl_FragColor = mix(light, dark, i);
}