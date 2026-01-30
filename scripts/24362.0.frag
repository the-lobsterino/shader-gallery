// ZALGO

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const float pi = 3.14159265358979323;

float smoothpulse(float a, float b, float x, float k) {
	return smoothstep(a, a + k, x) - smoothstep(b - k, b, x);
}

float ring(vec2 p, float r, float w) {
	float col = 0.0;
	float d = length(p);
	col = smoothpulse(r, r + w, d, 0.01);
	return clamp(col, 0.0, 1.0);
}

float line(vec2 p, vec2 a, vec2 b, float r) {
	vec2 pa = p - a,  ba = b - a;
	float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
	float res = length( pa - ba*h ) - r;
    	return smoothstep(0.01, 0.0, res);
}

float wavy_box(vec2 p) {
	p.x *= 1.1 + sin(p.y * pi * 5.0 + time * 10.0) * 4.1;
	p.y *= 0.8;
	float res = max(abs(p.x), abs(p.y));
	return smoothstep(0.55, 0.24, res);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	p = p * 1.6 - 1.0;
	p.x *= resolution.x / resolution.y;

	float col = 0.0;
	float face = ring(p, 0.5, 0.05);
	vec2 l_eye_center = vec2(-0.21, -0.03);
	vec2 r_eye_center = l_eye_center * vec2(-1.0, 1.0);
	float eye_r = 0.06;
	float theta = pi * 0.18;
	float eye_line_r = 0.02;
	vec2 l_v_eye = eye_line_r * vec2(-cos(theta), sin(theta));
	vec2 r_v_eye = eye_line_r * vec2(cos(theta), sin(theta));
	
	float cap = line(p, vec2(-0.48, 0.15), vec2(0.6, 0.15), 0.018);
	float l_eye = ring(p - l_eye_center, eye_r, 0.15);
	float r_eye = ring(p - r_eye_center, eye_r, 0.1);
	float l_eye_line = line(p, l_eye_center + l_v_eye * 0.0, l_eye_center + l_v_eye * 6.0, 0.018);
	float r_eye_line = line(p, r_eye_center + r_v_eye * 0.0, r_eye_center + r_v_eye * 3.0, 0.08);
	
	float nose = line(p, vec2(0.0, -0.1), vec2(0.01, -0.2), 0.018);
	float mouth = wavy_box(p - vec2(0.0, -0.58));
	
	col = face + cap + l_eye + r_eye + l_eye_line + r_eye_line + nose + mouth;
	col = 1.0 - clamp(col, 0.0, 1.0);
	
	gl_FragColor = vec4( vec3( col ), 1.0 );

}