#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = (2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	float k = sin(dot(uv, uv) * 32.0 - time * 10.0);
	float k1 = sin(dot(uv * 0.75, uv) * 16.0 - time * 10.0);
	float k2 = sin(dot(uv * 0.5, uv) * 8.0 - time * 10.0);
	vec3 col = vec3(1, 1, 1) * abs(k);
	col = mix(vec3(0.25, 0, 1), vec3(0.25, 0.75, 2.0), k + k1 + k2);
	if(k > 0.05) col += vec3(1, 0.25, 0.25);

	gl_FragColor = vec4(col, 1.0);

}