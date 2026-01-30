#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
vec2 p = ( gl_FragCoord.xy / resolution.xy ) ;

vec3 ccc =vec3(0xcc, 0x44, 0xcc) / 255.0;
//* 204, 68, 204	#CC44CC

gl_FragColor = vec4(vec3(ccc*p.y),25.0);
}