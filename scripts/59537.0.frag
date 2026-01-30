precision lowp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 cmul(vec2 a, vec2 b) {
	return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
float mbrot(vec2 pos) {
	vec2 iter = vec2(0.0);
	for (int i = 0; i < 32; ++i) {
		iter = cmul(iter, iter) + pos;
	}
	return length(iter);
}

vec3 hue_rgb(float hue) {
	vec3 col;
	float a = cos(hue * 3.14 * 1.5); 
	float b = sin(hue * 3.14 * 1.5);
	col.r = max(-min(0.0, b), a);
	col.g = max(0.0, b);
	col.b = -min(0.0, a);
	mat3 colmat = mat3(
		vec3(0.5, 0.0, 0.1),
		vec3(0.0, 1.0, 0.0),
		vec3(0.0, 0.0, 1.0)
	);
	return normalize(colmat * col);
}

float gethue(vec2 pos) {
	vec2 ndc = pos * 2.0 - 1.0;
	ndc *= vec2(resolution.x / resolution.y, 1.0);
	ndc *= sin(sqrt(abs(ndc)) + time) * 1000.0;
	return length(ndc) + time;
}

void main( void ) {
	vec2 pos = gl_FragCoord.xy / resolution.xy;

	float hue = gethue(pos);
	gl_FragColor.rgb = hue_rgb(hue);
	gl_FragColor.a = 1.0;

}
