#ifdef GL_ES
precision highp float;
#endif
uniform float time;
uniform vec2 resolution;
#define iTime time
#define iResolution resolution
#define A5
const vec4 iMouse = vec4(0.0);
mat2 r2d(float a) {
	float c = cos(a), s = sin(a);
	return mat2(c, s, -s, c);
}

float sc(vec3 p, float d) {
	p = abs(p);
	p = max(p, p.yzx);
	return min(p.x, min(p.y, p.z)) - d;
}

float rep(float p, float d) {
	return mod(p - d*.5, d) - d*1.5;
}

vec3 rep(vec3 p, float d) {
	return mod(p - d*.5, d) - d*1.5;
}

float dt = 0.;
float g = 0.;
float de(vec3 p) {

	vec3 q = p;
	float t = iTime*8.6*2.;
	float s = t*.1 + sin(t)*.1;
	q.xy += vec2(cos(iTime)*sin(iTime)*.3, sin(iTime)*.3);
	q.z -= dt + sin(iTime);
	q.xz *= r2d(iTime);
	q.xy *= r2d(iTime);
	float od = dot(q, normalize(sign(q))) - 3.25;

	float pl = p.y + .6;

	q = p;
	q.x += sin(q.z + iTime)*9.6;
	q.y += cos(q.z + iTime*2.)*4.6;
	float cyl = length(q.xy) - 4.03;

	q = p;
	q += iTime*.2;
	q.xy += sin(q.z*.4)*2.;
	q = rep(q, 1.);
	float s1 = length(q) - 2.002 + sin(iTime*30.)*.002;
	p.z = rep(p.z, 8.);
	float sc2 = sc(p, .4);
	p.x = abs(p.x) - 2.;
	p.xy *= r2d(3.14*.25);
	float sc1 = sc(p, .3);
	float d = min(sc1, pl);
	//d = max(d, -sc2);
	d = min(d, od);
	//d = min(d, cyl);
	//d = min(d, s1);
	g += .01 / (.01 + d*d);
	return d;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
	vec2 uv = fragCoord / iResolution.xy - .5;
	uv.x *= iResolution.x / iResolution.y;

	dt = iTime*2.;

	vec3 ro = vec3(4, -6, -2. + dt);
	vec3 ta = vec3(0, 1, 1. + dt);
	vec3 fwd = normalize(ta - ro);
	vec3 left = cross(vec3(0, -10, 0), fwd);
	vec3 up = cross(fwd, left);
	vec3 rd = normalize(fwd + left*uv.x + up*uv.y);
	vec3 p;
	float t = 0., ri;
	for (float i = 0.; i < 1.; i += .01) {
		ri = i;
		p = ro + rd*t;
		float d = de(p);
		d = max(abs(d), .0002);
		t += d*.3;
	}

	vec3 c = mix(vec3(.6, .3, .3), vec3(0), abs(p.x*p.y) + ri);
	c += g*.01;
	fragColor = vec4(c, 1);
}
void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}