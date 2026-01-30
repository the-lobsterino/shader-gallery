#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 red_col = vec3(1.0, 0.0, 0.0);

void main( void ) 
{
	gl_FragColor = vec4(red_col * abs(sin(time)), 0.0);
}