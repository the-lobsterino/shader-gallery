#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SAMPS 40000
#define BOUNCES 4

float rand(float n){return fract(sin(n) * 43758.5453123);}
float fakeRand(vec2 co, float time)
{
    return fract(sin(dot(time * co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

#define PI		3.14159265358979323846
#define _2PI	6.28318530717958647692

vec3 randInUnitSphere(vec2 co, float time)
{
	float angTheta = _2PI*fakeRand(co, time);
	float angPhi = _2PI*fakeRand(12.3456*co, time);
	float rad = fakeRand(45.6789*co, time);

	return vec3(rad*sin(angTheta)*cos(angPhi), rad*sin(angTheta)*sin(angPhi), rad*cos(angTheta));
}

float hitSphere(vec4 s, vec3 ro, vec3 rd) {
	vec3 oc = ro - s.xyz;
	float a = dot(rd, rd);
	float b = 2.0 * dot(oc, rd);
	float c = dot(oc, oc) - s.w*s.w;
	float discriminant = b*b - 4.0*a*c;
	if (discriminant < 0.0) {
		return -1.0;
	} else {
		return (-b - sqrt(discriminant) ) / (2.0*a);
	}
}
vec3 norSphere(vec4 s, vec3 p) {
	return (p - s.xyz) / s.w;	
}
vec4 hitScene(vec3 ro, vec3 rd, out float m) {
	vec4 s1 = vec4(0, 0, -4, 0.5);
	vec4 s2 = vec4(0, -50.5, -2, 50);
	
	float t = 100.0;
	vec3 n = vec3(0.0);
	
	float s1hit = hitSphere(s1, ro, rd);
	if (s1hit < t && s1hit > 0.0) { t = s1hit; n = norSphere(s1, ro+rd*t); m = 1.0; }
	
	float s2hit = hitSphere(s2, ro, rd);
	if (s2hit < t && s2hit > 0.0) { t = s2hit; n = norSphere(s2, ro+rd*t); m = 2.0; }
	
	return vec4(n, t);
}
vec3 rand3(vec3 x) {
	return vec3(
		rand(x.x * x.z),
		rand(x.y*45.234),
		rand(x.y * x.z * 34.4)
	);
}

void main() {
	vec3 finalCol = vec3(0.0);
	
	for (int i = 0; i < SAMPS; i++) {
		vec2 offset = vec2(0.0);
		offset.x = rand(gl_FragCoord.x);
		offset.y = rand(gl_FragCoord.y);
		vec2 p = gl_FragCoord.xy + offset;
		vec2 r = resolution;
		vec2 uv = (p - 0.5*r) / r.y;
		vec3 ro = vec3(0, 0, 0);
		vec3 rd = normalize(vec3(uv, -1.0));
		
		vec3 col = vec3(1.0);
		for (int b = 0; b < BOUNCES; b++) {
			float mat = 0.0;
			vec4 hit = hitScene(ro, rd, mat);
			if (hit.w < 100.0) {
				vec3 nor = hit.xyz;
				vec3 pos = ro + rd * hit.w;
				
				ro = pos+nor*0.001;
				vec3 tar = pos + nor + randInUnitSphere((pos + nor).xy, (pos+nor).z);
				rd = normalize(tar - pos);
				
				if (mat == 1.0) {
					col *= vec3(0.1, 0.7, 0.4);
				} else {
					col *= vec3(0.4, 0.2, 0.5);
				}
			} else {
				col *= mix(vec3(1.0), vec3(0.3, 0.8, 1.0), rd.y*0.5+0.5);
				break;
			}
		}
		

		finalCol += col;
	}
	finalCol /= float(SAMPS);
	gl_FragColor = vec4(pow(finalCol, vec3(0.4545)), 1.0);
}