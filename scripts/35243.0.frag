#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec3 co)
{
	return fract(sin(dot(co.xyz, vec3(12.9898, 78.233, 56.787))) * 43758.5453);
}

float noise(vec3 pos)
{
	vec3 ip = floor(pos);
	vec3 fp = smoothstep(0.0, 1.0, fract(pos));
	vec4 a = vec4(
		rand(ip + vec3(0, 0, 0)),
		rand(ip + vec3(1, 0, 0)),
		rand(ip + vec3(0, 1, 0)),
		rand(ip + vec3(1, 1, 0)));
	vec4 b = vec4(
		rand(ip + vec3(0, 0, 1)),
		rand(ip + vec3(1, 0, 1)),
		rand(ip + vec3(0, 1, 1)),
		rand(ip + vec3(1, 1, 1)));
 
	a = mix(a, b, fp.z);
	a.xy = mix(a.xy, a.zw, fp.y);
	return mix(a.x, a.y, fp.x);
}


float perlin(vec3 pos)
{
	return (noise(pos) * 32.0 +
		noise(pos * 2.0 ) * 16.0 +
		noise(pos * 4.0) * 8.0 +
		noise(pos * 8.0) * 4.0 +
		noise(pos * 16.0) * 2.0 +
		noise(pos * 32.0) * 1.0) / 64.0;
}

float box(vec3 pos, vec3 rect)
{
	return length(max(vec3(0.0), abs(pos) - rect)) - 0.01;	
}

float pipe(vec3 pos) {
	return length(fract(pos.xz / 3.0 + pos.y * 0.05) - 0.5) - 0.05;
}

float sphere(vec3 pos, float radius) {
	return length(pos) - radius;
}

vec3 repeat(vec3 pos, vec3 span) {
	return mod(pos, span) - span / 2.0;
}

float dist(vec3 pos) {
	return sphere(repeat(pos, vec3(0.9, 0.5, 0.5)), 0.2);
}

vec3 getColor(vec3 pos)
{
	//if (lgtm(pos) < 0.001) return vec3(1, 0, 0.5);
	return vec3(sin(pos.x), cos(pos.y), cos(time*0.2));
}
		   
vec3 getNormal(vec3 pos)
{
	float e = 0.001;
	return normalize(vec3(dist(pos) - dist(pos - vec3(e, 0, 0)),
		   dist(pos) - dist(pos - vec3(0, e, 0)),
		   dist(pos) - dist(pos - vec3(0, 0, e))));
}

mat3 rotateY(float a)
{
	float s = sin(a);
	float c = cos(a);
	return mat3(c, 0, s,
		    0, 1, 0,
		    -s, 0, c);
}

mat3 rotateX(float a)
{
	float s = sin(a);
	float c = cos(a);
	return mat3(1, 0, 0,
		    0, c, s,
		    0, -s, c);
}

float fresnel(float fz, vec3 normal, vec3 cameraspace){
    vec3 dir = normalize(reflect(normalize(cameraspace), normal));
    float base =  1.0 - abs(dot(normalize(normal), dir));
    return (fz + (1.0-fz)*(pow(base, 5.0)));
}

void main( void ) {

	vec2 tex = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	mat3 rot = rotateX(time * 0.05) * rotateY(time * 0.05);
	vec3 pos = vec3(0);
	vec3 dir = rot * normalize(vec3(tex, 0.5));
	
	vec3 color = vec3(1, 1, 1);
	vec3 origin = pos;
	for (int depth = 0; depth < 93; ++depth)
	{
		float d = dist(pos);
		pos += d * dir;
		if (d < 0.001)
		{
			vec3 normal = getNormal(pos);
			float light = max(0.0, 1.0 - 0.01 * distance(pos, vec3(0)));//max(dot(normal * rot, vec3(1, 1, -1) ), 0.0) + 0.3;
			color *= clamp(light * getColor(pos) * fresnel(0.04, normal, origin - pos), 0.0, 1.0);
			dir = reflect(dir, normal);
			origin = pos;
			pos += dir * 0.01;
		}
	}
	
	gl_FragColor = vec4(color, 1.0);

}