#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define time (time * .1)

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 p){
	vec2 ip = floor(p);
	vec2 u = fract(p);
	u = u*u*(3.0-2.0*u);
	
	float res = mix(
		mix(rand(ip),rand(ip+vec2(1.0,0.0)),u.x),
		mix(rand(ip+vec2(0.0,1.0)),rand(ip+vec2(1.0,1.0)),u.x),u.y);
	return res*res;
}

float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}


float sandDist(vec3 pos)
{
	float disp = noise(pos.xz + time) * 0.5;
	float n = noise(vec3(floor(pos.xz * 15.0), time * 6.0));
	n = clamp(n * 8.0 - 7.0, 0.0, 1.0);
	disp += - pow(clamp(1.0 -  length(fract(pos.xz * 15.0) - 0.5) * 4.0, 0.0, 1.0), 0.6) * n * 0.02;
	return pos.y + 0.1 + disp;
}

vec3 sandNormal(vec3 pos)
{
	return normalize(vec3(
		sandDist(pos + vec3(0.001, 0, 0)) - sandDist(pos - vec3(0.001, 0, 0)),
		sandDist(pos + vec3(0, 0.001, 0)) - sandDist(pos - vec3(0, 0.001, 0)),
		sandDist(pos + vec3(0, 0, 0.001)) - sandDist(pos - vec3(0, 0, 0.001))));
}

float duckDist(vec3 pos)
{
	float yPos = sandDist(vec3(0, 0, 0));
	return length(pos + vec3(0, yPos, 0)) - 0.5 ;
}

vec3 duckNormal(vec3 pos)
{
	return normalize(vec3(
		duckDist(pos + vec3(0.001, 0, 0)) - duckDist(pos - vec3(0.001, 0, 0)),
		duckDist(pos + vec3(0, 0.001, 0)) - duckDist(pos - vec3(0, 0.001, 0)),
		duckDist(pos + vec3(0, 0, 0.001)) - duckDist(pos - vec3(0, 0, 0.001))));
}

mat3 rotX(float a)
{
	return mat3(1, 0, 0,
		    0, cos(a), -sin(a),
		0, sin(a), cos(a));
}
mat3 rotY(float a)
{
	return mat3(cos(a), 0, -sin(a),
		    0, 1, 0,
		sin(a), 0, cos(a));
}

void main( void ) {

	vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	vec3 pos = vec3(0.0, 0.0, -2.0);
	vec3 dir = normalize(vec3(uv, 0.8));
	pos = rotY(time) * rotX(-0.4) * pos;
	dir = rotY(time) * rotX(-0.4) * dir;
	vec3 col = vec3(1);
	float len = 0.0;
	float depth = 99999999.0;
	for (float i = 0.0; i < 128.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = sandDist(p);
		float f = rand(vec2(d/5., len))*.00625;
		len += d;
		if (d < f*len) {
			float w = 0.5;
			float light = clamp((dot(sandNormal(p), normalize(vec3(1, 1, -1))) + w) / ((1.0 + w) * (1.0 + w)), 0.0, 1.0);
			col = mix(vec3(0.9, 0.8, 0.5), vec3(0.7, 0.5, 0.3), noise(p.xz * 300.0)) * light;
			depth = len;
			break;
    		}
	}
	
	len = 0.0;
	for (float i = 0.0; i < 64.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = duckDist(p);
		len += d;
		if (d  < .001 && len < depth) {
			float w = 0.8;
			float light = clamp((dot(duckNormal(p), normalize(vec3(1, 1, -1))) + w) / ((1.0 + w) * (1.0 + w)), 0.0, 1.0);
			col = vec3(1, 1, 0) * light;
			depth = len;
			break;
    		}
	}
	
	gl_FragColor = vec4(col += 0.1, 1.0 );

}