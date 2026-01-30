#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float hash(vec3 v3) {
	return fract(sin(dot(v3, vec3(12.3, 45.6, 78.9))) * 987654.321);
}

void main( void ) {
	vec2 uv = surfacePosition;//(2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 p = vec3(0.0, 0.0, 10.0);
	vec3 rd = (vec3(uv, -1.));

	gl_FragColor = vec4(vec3(hash(rd)), 1.0);
}