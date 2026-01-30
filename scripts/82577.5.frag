#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 get_sky()
{
	return vec3(0.234, 0.358, 0.408);
}

void pR(inout vec2 p, float a){
	p = cos(a)*p - sin(a) * vec2(p.y, -p.x);
}

void mouseControl(inout vec3 rd){
	vec2 m = mouse;
	pR(rd.xz, m.y * 3.14159265 *0.5 -0.5);
	pR(rd.yx, m.x * 3.14159265 * 2.);
}

vec2 sphIn(in vec3 ro, in vec3 rd, float ra) {
	float b = dot(ro, rd);
	float c = dot(ro, ro) - ra * ra;
	float h = b * b - c;
	if(h < 0.0) return vec2(-1.0);
	h = sqrt(h);
	return vec2(-b - h, -b + h);
}
vec2 boxIn(in vec3 ro, in vec3 rd, in vec3 rad, out vec3 oN)  {
	vec3 m = 1.0 / rd;
	vec3 n = m * ro;
	vec3 k = abs(m) * rad;
	vec3 t1 = -n - k;
	vec3 t2 = -n + k;
	float tN = max(max(t1.x, t1.y), t1.z);
	float tF = min(min(t2.x, t2.y), t2.z);
	if(tN > tF || tF < 0.0) return vec2(-1.0);
	oN = -sign(rd) * step(t1.yzx, t1.xyz) * step(t1.zxy, t1.xyz);
	return vec2(tN, tF);
}

float plaIn(in vec3 ro, in vec3 rd, in vec4 p) {
	return -(dot(ro, p.xyz) + p.w) / dot(rd, p.xyz);
}

float Light(vec3 n, vec3 light)
{
	float diffuse = dot(light, n);
	return diffuse;
}

bool tin(vec3 light){
        return true;
}

vec3 rayCast(vec3 ro, vec3 rd)
{
	vec2 minIt = vec2(9999);
	vec2 it;
	vec3 c = vec3(0.0);
	vec3 col = get_sky();
	vec3 n;
	vec3 light = normalize(vec3(-0.5, 0.75, 0.5));

	vec3 boxN;
	vec3 boxPos = vec3(0.0, -1.0, 0.0);
	it = boxIn(ro - boxPos, rd, vec3(1.0), boxN);
	if (it.x > 0.0 && it.x < minIt.x)
	{
		minIt = it;
		n = boxN;
		col = vec3(1.0, 0.0, 0.0);
	}

	vec3 sphPos = vec3(0.0, 1.0, 0.0);
	it = sphIn(ro - sphPos, rd, 1.);
	if (it.x > 0.0 && it.x < minIt.x)
	{
		minIt = it;
		n = (ro + rd * it.x) - sphPos;
		col = vec3(0.0, 1.0, 0.0);
	}
	
	vec3 planeNormal = vec3(0.0, 0.0, 1.0);
	it = vec2(plaIn(ro, rd, vec4(planeNormal, 1.0)));
	if(it.x > 0.0 && it.x < minIt.x) {
		minIt = it;
		n = planeNormal;
		col = vec3(0);
	}

	c = vec3(Light(n, light));
	return c + col;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy *2.0 - resolution.xy ) / resolution.y;
	vec3 ro = vec3(-5, 0 ,0);
    vec3 rd = normalize(vec3 (1, uv));
	mouseControl(rd);

    vec3 c = rayCast(ro, rd);
    gl_FragColor = vec4(c, 1.0);
}