#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 col;


void main( void )
{
const float PI = 3.1415926535;
vec2 uv = (gl_FragCoord.xy*2.-resolution.xy)/resolution.y+0.3;}