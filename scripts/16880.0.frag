#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 uv = (gl_FragCoord.xy/resolution.xy * 2. - 1.) * vec2(resolution.x/resolution.y, 1.);
	float s = length(uv)*time;
	gl_FragColor = vec4(mod(s*3.*s*5.*s*17.*s*257.+1., 65537.));
}