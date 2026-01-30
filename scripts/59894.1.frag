#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
float sdEllipsoid( in vec3 p, in vec3 r )
{
    return (length( p/r ) - 1.0) * min(min(r.x,r.y),r.z);
}
float smin( float a, float b, float k )
{
    float res = +exp( -k*a ) + exp( -k*b );
    return -log( res )/k;
}

float smax( float a, float b, float k )
{
    float res = +exp( k*a ) + exp( k*b );
    return log( res )/k;
}

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
	float disp = noise(pos.xz + time) * 0.15;
	float n = noise(vec3(floor(pos.xz * 15.0), time * 6.0));
	n = clamp(n * 8.0 - 7.0, 0.0, 1.0);
	disp += - pow(clamp(1.0 -  length(fract(pos.xz * 15.0) - 0.5) * 4.0, 0.0, 1.0), 0.6) * n * 0.01;
	return pos.y + 0.1 + disp*0.5;
}

vec3 sandNormal(vec3 pos)
{
	return normalize(vec3(
		sandDist(pos + vec3(0.001, 0, 0)) - sandDist(pos - vec3(0.001, 0, 0)),
		sandDist(pos + vec3(0, 0.001, 0)) - sandDist(pos - vec3(0, 0.001, 0)),
		sandDist(pos + vec3(0, 0, 0.001)) - sandDist(pos - vec3(0, 0, 0.001))));
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
mat3 rotZ(float a)
{
	return mat3(cos(a), -sin(a), 0,
		    sin(a), cos(a), 0,
		0, 0, 1);
}
float duckDist(vec3 pos)
{
	vec3 norm = sandNormal(vec3(0));
	pos = rotZ(-norm.x) * pos;
	pos = rotX(norm.z) * pos;
	pos.y += sandDist(vec3(0, 0, 0)) - 0.2;
	
	return smin(smax(length(pos) - 0.5, pos.y, 8.0) , length(pos + vec3(0, -0.2, 0.2)) - 0.2, 16.0);
}

vec3 duckNormal(vec3 pos)
{
	return normalize(vec3(
		duckDist(pos + vec3(0.001, 0, 0)) - duckDist(pos - vec3(0.001, 0, 0)),
		duckDist(pos + vec3(0, 0.001, 0)) - duckDist(pos - vec3(0, 0.001, 0)),
		duckDist(pos + vec3(0, 0, 0.001)) - duckDist(pos - vec3(0, 0, 0.001))));
}

float duckEyeDist(vec3 pos)
{
	vec3 norm = sandNormal(vec3(0));
	pos = rotZ(-norm.x) * pos;
	pos = rotX(norm.z) * pos;
	pos.y += sandDist(vec3(0, 0, 0)) - 0.2;
	pos.x = abs(pos.x);
	return length(pos - vec3(0.08, 0.25, -0.35)) - 0.03;
}

vec3 duckEyeNormal(vec3 pos)
{
	return normalize(vec3(
		duckEyeDist(pos + vec3(0.001, 0, 0)) - duckEyeDist(pos - vec3(0.001, 0, 0)),
		duckEyeDist(pos + vec3(0, 0.001, 0)) - duckEyeDist(pos - vec3(0, 0.001, 0)),
		duckEyeDist(pos + vec3(0, 0, 0.001)) - duckEyeDist(pos - vec3(0, 0, 0.001))));
}

float duckLaserDist(vec3 pos)
{
	vec3 norm = sandNormal(vec3(0));
	pos = rotZ(-norm.x) * pos;
	pos = rotX(norm.z) * pos;
	pos.y += sandDist(vec3(0, 0, 0)) - 0.2;
	pos.x = abs(pos.x);
	return max(pos.z + 0.4, length(pos.xy - vec2(0.08, 0.25)));
}

float duckMouthDist(vec3 pos)
{
	vec3 norm = sandNormal(vec3(0));
	pos = rotZ(-norm.x) * pos;
	pos = rotX(norm.z) * pos;
	pos.y += sandDist(vec3(0, 0, 0)) - 0.2;
	return sdEllipsoid(pos - vec3(0, 0.17, -0.35), vec3(0.13, 0.05, 0.1)) ;
}

vec3 duckMouthNormal(vec3 pos)
{
	return normalize(vec3(
		duckMouthDist(pos + vec3(0.001, 0, 0)) - duckMouthDist(pos - vec3(0.001, 0, 0)),
		duckMouthDist(pos + vec3(0, 0.001, 0)) - duckMouthDist(pos - vec3(0, 0.001, 0)),
		duckMouthDist(pos + vec3(0, 0, 0.001)) - duckMouthDist(pos - vec3(0, 0, 0.001))));
}

float distAll(vec3 pos)
{
	float d = 1E9;
	d = min(d, sandDist(pos));
	d = min(d, duckEyeDist(pos));
	d = min(d, duckMouthDist(pos));
	d = min(d, duckDist(pos));
	return d;
}

void main( void ) {
	float laser = exp(-7.0 * mod(time, 2.0));

	vec2 uv = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	vec3 pos = vec3(0.0, 0.0, -1.5);
	pos += vec3(sin(time * 90.0), sin(time * 84.0), sin(time * 73.1)) * 0.1 * laser;
	vec3 dir = normalize(vec3(uv, 0.8));
	pos = rotY(0.2 + sin(time) * 0.2) * rotX(-0.4) * pos;
	dir = rotY(0.2 + sin(time) * 0.2) * rotX(-0.4) * dir;
	vec3 col = vec3(0);
	float len = 0.0;
	float depth = 1E9;
	vec3 outPos = vec3(1);
	vec3 outNorm = vec3(1);
	
	for (float i = 0.0; i < 144.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = sandDist(p);
		len += d;
		if (d < 0.001) {
			col = mix(vec3(0.7, 1.7, 3.5), vec3(0.3, 0.9, 1.3), noise(p.xz * 300.0));
			depth = len;
			outPos = p;
			outNorm = sandNormal(p);
			break;
    		}
	}
	
	len = 0.0;
	for (float i = 0.0; i < 90.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = duckDist(p);
		len += d;
		if (d < 0.001 && len < depth) {
			col = vec3(1, 1, 0);
			depth = len;
			outPos = p;
			outNorm = duckNormal(p);
			break;
    		}
	}
	
	len = 0.0;
	for (float i = 0.0; i < 16.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = duckEyeDist(p);
		len += d;
		if (d < 0.001 && len < depth) {
			col = fract(time * 10.0) < 0.5 ? vec3(3, 0, 0) : vec3(0.2);
			depth = len;
			outPos = p;
			outNorm = duckEyeNormal(p);
			break;
    		}
	}
	
	
	len = 0.0;
	for (float i = 0.0; i < 16.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = duckMouthDist(p);
		len += d;
		if (d < 0.001 && len < depth) {
			col = vec3(1, 0.5, 0);
			depth = len;
			outPos = p;
			outNorm = duckMouthNormal(p);
			break;
    		}
	}
	
	len = 0.0;
	float mindist = 1E9;
	for (float i = 0.0; i < 16.0; ++i)
	{
    		vec3 p = pos + len * dir;
    		float d = duckLaserDist(p);
		len += d;
		mindist = min(mindist, d);
	}
	col += vec3(100.0, 4.0, 14.0) * exp(-mindist * 30.0 / laser) * laser;
	
	float w = 0.8;
	float light = clamp((dot(outNorm, normalize(vec3(1, 1, -1))) + w) / ((1.0 + w) * (1.0 + w)), 0.0, 1.0);
	
	if (depth < 1E9)
	{
    		col *= light;
		col *= clamp( distAll(outPos + outNorm * 0.05) * 30.5, 0.0, 1.0) * 0.5 + 0.5;
	}
	gl_FragColor = vec4(col + 0.1, 1.0 );

}