#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 p = gl_FragCoord.xy / resolution.xy;
	gl_FragColor = texture2D(backbuffer, p);
	if (time < 1.0) gl_FragColor = vec4(1.0, 1.0, 0.0, 0.0);
}