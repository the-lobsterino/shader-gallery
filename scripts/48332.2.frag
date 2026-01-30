#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {

	vec2 cPos = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	float cLength = length(cPos);

	vec2 uv = gl_FragCoord.xy / resolution.xy + cPos / cLength * sin(cLength * 60.0 - time * 10.0) * 0.03;
	
	gl_FragColor = vec4(uv, 0.0, 1.0);

}