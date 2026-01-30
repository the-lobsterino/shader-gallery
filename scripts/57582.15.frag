precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
const float PI = 3.14159265358979323846;
float r = 0.0;
float g = 0.0;
float b = 0.0;
float a = 1.0;
vec4 colorSwap(float t) {
	float sint = sin(t) < 0.0 ?  abs(sin(t)) : sin(t);
	float cost = cos(t) < 0.0 ?  abs(cos(t)) : cos(t);
	float tant = tan(t) < 0.0 ?  abs(tan(t)) : tan(t);
	r = sint;
	g = cost;
	b = tant;
	return vec4(r, g, b, a);
}
vec4 clock(float f) {
	float sinf = sin(f) < 0.0 ?  abs(sin(f)) : sin(f);
	float cosf = cos(f) < 0.0 ?  abs(cos(f)) : cos(f);
	float tanf = tan(f) < 0.0 ?  abs(tan(f)) : tan(f);
	vec4 x1 = vec4(sinf);
	vec4 x2 = vec4(0.0);
	vec4 v = gl_FragCoord;
	vec4 test = smoothstep(x2, x1, v);
	return test;
}
void main() {
	vec2 pos = (gl_FragCoord.xy / resolution);

	vec2 v = mix(vec2(0.2, 0.2), pos, time*9.0);
	v /= time*.9;

	gl_FragColor = vec4(v, v);
	if (distance(pos, mouse) < 0.1) {
		gl_FragColor = vec4(sin(time), sin(time), clamp(abs(sin(time)), 0.125, 0.975), 1.0);
		//discard;
	}

/**
	// later on will it be hardcoded 16:9
	vec3 pos = (gl_FragCoord.xyz) / resolution.x;

	float sint = sin(time) < 0.0 ?  abs(sin(time)) : sin(time);
	vec4 v = vec4(pos / sint);
	//vec4 v = colorSwap(time/PI);
	//vec4 v = clock(time);

	//if (cross x <> gl_FragCoord.xy <> cross y) {
	gl_FragColor = vec4(v);
*/
}