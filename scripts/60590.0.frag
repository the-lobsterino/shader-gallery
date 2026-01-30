#ifdef GL_ES
precision mediump float;
#endif
// the shit your mom

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.141592653589793;

float pulse(float a, float b, float k, float x) {
	return smoothstep(a, a + k, x) - smoothstep(b - k, b, x);
}

float hash(vec2 p) {
	return fract(sin(p.x * 15.35 + p.y * 35.79) * 43758.23);
}

float line(vec2 p, vec2 a, vec2 b, float r) {
	vec2 pa = p - a, ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - h * ba) - r;
}

float tile(vec2 p) {
	vec2 g = floor(p);
	float theta = hash(g) > 0.5 ? 0.0 : pi * 0.5;
	float c = cos(theta);
	float s = sin(theta);
	mat2 m = mat2(c, s, -s, c);
	p = m * p;
	vec2 f = fract(p);
	float a = length(f);
	float w = 0.12;
	a = pulse(0.5 - w, 0.5 + w, w * 0.9, a);
	a = smoothstep(w * 2.0, 0.0, a);

	float b = length(f - vec2(1.0));
	b = pulse(0.5 - w, 0.5 + w, w * 0.9, b);
	b = smoothstep(w * 2.0, 0.0, b);
	
	return min(a, b);
}

float tile2(vec2 p) {
	vec2 g = floor(p);
	float theta = hash(g) > 0.5 ? 0.0 : pi * 0.5;
	float c = cos(theta);
	float s = sin(theta);
	mat2 m = mat2(c, s, -s, c);
	p = m * p;
	vec2 f = fract(p);
	float col = 1.0;
	col = min(col, line(f, vec2(0.5, 0.0), vec2(1.0, 0.5), 0.1));
	col = min(col, line(f, vec2(0.0, 0.5), vec2(0.5, 1.0), 0.1));
	col = 1.0 - smoothstep(0.01, 0.0, col);
	
	return col;
}
void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	float theta = pi * 0.25;
	float c = cos(theta);
	float s = sin(theta);
	p = mat2(c, -s, s, c) * p;
	float col = tile2(p * 20.0 + time);
	
	gl_FragColor = vec4( vec3( col ), 1.0 );

}