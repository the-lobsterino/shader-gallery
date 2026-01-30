#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.14159265358979;
const float pi2 = pi * 2.0;

vec3 hsv(float h, float s, float v){
    vec4 t = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(vec3(h) + t.xyz) * 6.0 - vec3(t.w));
    return v * mix(vec3(t.x), clamp(p - vec3(t.x), 0.0, 1.0), s);
}

mat2 rot(float a){
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

vec2 pmod(vec2 p, float r){
	float a = atan(p.x, p.y) + pi / r;
	float n = pi2 / r;
	a = floor(a / n) * n;
	return p * rot(-a);
}

vec3 spiral(vec3 p, float offset){
	return vec3(2.0 + cos(p.y + offset), p.y, 2.0 + sin(p.y + offset)); 
}

vec3 bar(vec3 p){
	float div = pi2 / 10.0;
	float y = floor(p.y / div) * div;
	float amp = abs(cos(y)) * 0.6;
	p.x = clamp(p.x, 2.0 - amp, 2.0 + amp);
	return vec3(p.x, y, p.z);
}

float map(vec3 p){
	p.x += time;
	p = mod(p, vec3(4.0, pi2, 4.0));
	float d = 10.0;
	vec3 p1 = spiral(p, 0.0);
	vec3 p2 = spiral(p, pi);
	vec3 p3 = bar(p);
	float d1 = length(p1 - p) - 0.1;
	float d2 = length(p2 - p) - 0.1;
	float d3 = length(p3 - p) - 0.1;
	return min(min(d1, d2), d3);
}

void main( void ) {

	vec2 st = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
	
	float screenZ = 0.3;
	vec3 ro = vec3(0.0 + st.x * 10.0, time * 1.5 + st.y * 10.0, -15.0);
	vec3 rd = normalize(vec3(0.0, 0.0, screenZ));
	//vec3 ro = vec3(0.0, time * 1.5, time);
	//vec3 rd = normalize(vec3(st, screenZ));
	float ac = 0.0;
	float t = 0.0;
	float step = 0.0;
	vec3 p = ro;
	
	float depth = 0.0;
	vec3 col = vec3(0.0);
	
	// マーチングループ
	for(int i=0;i<99;i++){
		float d = max(abs(map(p)), 0.01);
		t += d * 0.5;
		p = ro + rd * t;
		step = float(i);
		ac += exp(-d * 2.0);
	}
	
	gl_FragColor = vec4(hsv(p.y * 0.01 + time * 0.1 + sin(p.x) * 0.05, 1.0, 0.5 + sin(time * 2.5) * 0.2) * vec3(0.01 * ac + 0.001 * step), 1.0);

}