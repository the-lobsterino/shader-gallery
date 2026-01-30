#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.141592;

float sdCapsule(vec2 p, vec2 a, vec2 b, float r) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - h * ba) - r;
}

float sdGlobe(vec2 p, vec2 a, vec2 b, float r) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	float k = 0.05;
	float w = -k*pow(h - 0.5,2.0) + k*0.25;
	return length(pa - h * ba) - r - w;
}

float sdStarPetal(vec2 p, vec2 a, vec2 b, float r) {
	vec2 pa = p - a;
	vec2 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
	return length(pa - h * ba) - mix(r, 0.03, h);
}

float smin(float a, float b, float k) {
	float h = clamp((b - a)/k *0.5 + 0.5, 0.0, 1.0);
	return mix(b, a, h) - k * h * (1.0 - h);
}

void main( void ) {

	//vec2 p = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	float col = 0.0;
	float d = 1.0;
	float d2 = 1.0;
	for(int i = 0; i < 5; i++) {
		float theta = float(i)/5.0 * pi * 2.0;
		vec2 q = vec2(cos(theta), sin(theta)) * 0.5;
		d = min(d, sdStarPetal(p, vec2(0.0, 0.0), q, 0.2));
		d2 = min(d2, length(p - q) - 0.005);
	}
	//d = smin(d, d2, 0.04);
	col = smoothstep(0.0, 0.01, d);
	//col = length(p) - 0.5;
	//col = smoothstep(0.0, 0.01, col);
	vec3 c1 = vec3(0.0, 1.0, 0.4);
	vec3 c2 = vec3(0.3, 0.4, 0.35);

	gl_FragColor = vec4( vec3(col), 1.0 );

}