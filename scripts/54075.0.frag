#ifdef GL_ES
precision highp float;
#endif


#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float FR = 0.2;
const float FRS = FR * 123.0;

float map(vec3 p) {
	float t = 3.0 + dot(p, vec3(0, 1, 0)) + sin(p.x * FR + sin(p.z * 0.02) * 50.1) + sin(p.z * FR);
	float tu = 7000.0 + dot(p, vec3(0, -1, 0));
	t = min(t, tu);
	t = min(t, 4000.0 + dot(p, vec3(0, -1, 0)));
	t = min(t, length(p + vec3(3000, -3000.4, -4000.0)) - 1500.0);
	t = min(t, length(p + vec3(-3500, -3500.4, -5000.0)) - 150.0);
	return t;
}

vec3 getnor(vec3 p) {
	vec2 d = vec2(0.001, 0.0);
	float t = map(p);
	return normalize(vec3(
		t - map(p + d.xyy),
		t - map(p + d.yxy),
		t - map(p + d.yyx)));
}
float rand(float n){return fract(sin(n) * 43758.5453123);}
vec4 getcolor(vec2 uv, vec2 a) {
	
	vec3 dir = normalize(vec3(uv + a, 1.0));
	vec3 pos = vec3(5, 10, sin(time) + 50.0 + rand(uv.x + dir.z * FRS) * rand(uv.y + dir.z * FRS));
	float t = 0.0;
	for(int i = 0; i < 50; i++) {
	    float k = map(dir * t + pos);
	    if(k < 0.1) break;
		t += k;
	}
	vec3 ip = dir * t + pos;
	vec3 N = getnor(ip);
	vec3 col = vec3(0.0);
	const vec3 cnear = vec3(2.0, 1.2, 0.5);
	const vec3 cfar = cnear.zyx;
	col += mix(cfar, cnear, min(1.0, t));
	col *= max(0.025, dot(normalize(vec3(2,-0.5,0.2)), N)) * vec3(1.0, 0.7, 0.8);
	col += (cfar * 0.1) * sqrt(t) * 0.04;
	col = pow(col, vec3(1.0 / 2.2));
	return vec4(col, 1.0);
}
void main() {
    vec4 col = vec4(0.0);
    vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
    vec2 a = vec2(0.00625 * length(uv * 0.5), 0.0);
    col += getcolor(uv, vec2(a.xy));
    col += getcolor(uv, vec2(a.yx));
    col += getcolor(uv, vec2(-a.xy));
    col += getcolor(uv, vec2(-a.yx));
    col /= vec4(4.0);
    gl_FragColor = col;
}