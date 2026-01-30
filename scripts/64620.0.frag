#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec4 trace (vec2 pos)
{
	
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	

	gl_FragColor = vec4();

}