// author: @aadebdeb (https://twitter.com/aa_debdeb)

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float line(vec2 p, vec2 p1, vec2 p2, float w) {
	float a = p1.y - p2.y;
	float b = -p1.x + p2.x;
	float c = p1.x * p2.y - p2.x * p1.y;
	
	float d = abs(a * p.x + b * p.y + c) / sqrt(pow(a, 2.0) + pow(b, 2.0));
	
	return smoothstep(0.0, d, w);
}

void main( void ) {
	
	vec2 st = gl_FragCoord.xy /min(resolution.x, resolution.y) * 2.0 - resolution / min(resolution.x, resolution.y);

	vec3 color = vec3(0.05);
	for (int i = 1; i <= 10; i++) {
		vec2 p1 = vec2(sin(sin(time * 0.269 * float(i) + float(i)) / float(i) * 1.95), -1.0);
		vec2 p2 = vec2(sin(sin(time * 0.363 * float(i) + float(i)) / float(i) * 2.03), 1.0);
		vec3 c = vec3(0.0);
		c += vec3(1.0, 0.0, 0.0) * line(st, p1, p2, 0.005);
		c += vec3(0.0, 1.0, 0.0) * line(st, p1, p2, 0.01);
		c += vec3(0.0, 0.0, 1.0) * line(st, p1, p2, 0.03);
		color.r = c.r > color.r ? c.r : color.r;
		color.g = c.g > color.g ? c.g : color.g;
		color.b = c.b > color.b ? c.b : color.b;
	}
	
	gl_FragColor = vec4(color, 1.0);
}