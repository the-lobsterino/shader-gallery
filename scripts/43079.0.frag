// author @aadebdeb

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 norm(vec2 xy) {
	float m = max(resolution.x, resolution.y);
	return xy / m * 2.0 - resolution / m;
}

void main( void ) {
	vec2 uv = norm(gl_FragCoord.xy);
	float d = length(mouse * 2.0 - 1.0);

	float scale = d *300.0;
	
	float  v = sin(time * 2.5 - uv.x * 0.7 + uv.y * 1.0) * 0.5 + 1.0;
	vec4 c1 = vec4(0.9, 0.9, 0.9, 1.0);
	vec4 c2 = (1.0 - v) * vec4(0.7, 0.2, 0.1, 1.0) + v * vec4(0.1, 0.2, 0.4, 1.0);
	
	gl_FragColor = sin(uv.x * scale) * sin(uv.y * scale) > 0.0 ? c1 : c2;

}