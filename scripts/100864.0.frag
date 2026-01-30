#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define ONE_THIRD (1.0/3.0)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float calcHue(float h){
	return clamp(-6.0 * distance(ONE_THIRD, mod(h, 1.0)) + 2.0, 0.0, 1.0);
}

float calcSV(float i, float s, float v){
	return s * v * (i - 1.0) + v;
}

vec3 hsv(float h, float s, float v){
	return vec3(
		calcSV(calcHue(h + ONE_THIRD), s, v),
		calcSV(calcHue(h), s, v),
		calcSV(calcHue(h - ONE_THIRD), s, v)
	);
}

vec2 conj(vec2 a){
	return vec2(a.x, -a.y);
}

vec2 cmul(in vec2 a, in vec2 b) {
	return vec2(a.x * b.x - a.y * b.y, a.y * b.x + a.x * b.y);
}

void main( void ) {
	vec2 i = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y * 2.0;
	
	vec2 o = cmul(i, cmul(i, i)) + vec2(0.2, 0.0);
	
	float phi = atan(o.y, o.x)+time;
	float r = clamp(length(o) * 100.0, 0.0, 1.0);
	vec3 color = hsv(phi / 3.1415927 / 2.0, 1.0, r);
	gl_FragColor = vec4(color, 1.);
}