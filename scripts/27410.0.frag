#ifdef GL_ES
precision mediump float;
#endif

// Perlin noise

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float noise2(vec2 p) {
	return fract(sin(15.8 * p.x + 35.7 * p.y) * 43648.23)*2.0 - 1.0;
}

float dotGridGradient(vec2 ip, vec2 p){
	// noise2 function that returns a vec2 would be better
	return dot(p - ip, vec2(noise2(ip), noise2(ip + 100.0)));
}

float noise(vec2 p){
	vec2 ip = floor(p), u = fract(p);
	u = (3.0 - 2.0*u)*u*u;
	float f0 = dotGridGradient(ip + vec2(0.0, 0.0), p);
	float f1 = dotGridGradient(ip + vec2(1.0, 0.0), p);
	float f2 = dotGridGradient(ip + vec2(0.0, 1.0), p);
	float f3 = dotGridGradient(ip + vec2(1.0, 1.0), p);
	return mix(mix(f0, f1, u.x), mix(f2, f3, u.x), u.y);
}

void main() {
	vec2 p = gl_FragCoord.xy / resolution.xy * 10.0/mouse.y;
	p.x *= resolution.x/resolution.y;
	gl_FragColor = vec4(vec3(noise(p)*0.5 + 0.5), 1.0);
}