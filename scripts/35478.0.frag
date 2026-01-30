#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
const float pi = 3.141592653589793;

float map(vec2 p) {
	float a = atan(p.y, p.x) / pi;
	float d = length(p);
	float k = sin(pow(sin(d * pi * 2.0), -2.0) + a - time);
	k = sin(k * pi * 3.0 + time);
	return k + 0.5 * (sin(a * pi * 24.0  + d*33.));
}

vec3 calcNormal(vec2 p) {
	vec2 e = vec2(0.001, 0.0);
	vec3 nor = vec3(
		map(p + e.xy) - map(p - e.xy),
		map(p + e.yx) - map(p - e.yx),
		map(p) * 0.3
	);
	return normalize(nor);
}

void main() { 
	vec2 p = gl_FragCoord.xy / resolution;
	p = 2.0 * p - 1.0;
	p.x *= resolution.x / resolution.y;
	vec3 rd = normalize(vec3(0.0, 0.0, -2.7));
	vec3 nor = calcNormal(p);
	vec3 lig = normalize(vec3(p.x, p.y, 0.0) - vec3((mouse.x * 2.0 - 1.0) * resolution.x / resolution.y, mouse.y * 2.0 - 1.0, -1.0));
	float dif = clamp(dot(nor, lig), 0.0, 1.0);
	float spe = pow(clamp(dot(reflect(rd, nor), lig), 0.0, 1.0), 128.0);
	float fre = 1.0 - dot(-rd, nor);
	float r = map(p);
	vec3 c1 = vec3(0.2, 0.3, 0.0);
	vec3 c2 = vec3(0.75, 0.85, 0.0);
	vec3 c3 = vec3(0.0, 1.0, 0.7);
	vec3 g = mix(mix(c1, c2, smoothstep(0.0, 0.5, r)), c3, smoothstep(0.5, 1.0, r));
	g = mix(vec3(1.0, 0.0, 0.0), g, dif);
	
	vec3 col =  1.2 * g * dif + spe + fre * 0.1;
	gl_FragColor = vec4(col, 1.0);
}