#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.1415926535

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 repeat(vec3 pos, vec3 span)
{
	return mod(pos, span) - span / 2.0;
}

float box(vec3 pos, vec3 rect)
{
	return length(max(vec3(0.0), abs(pos) - rect));	
}

float pipe(vec3 pos) {
	return length(repeat(pos + pos.y * vec3(sin(pos.z), 0, 0),  vec3(2.0, 2.0, 2.0)).xz) - 0.1;
}

float boxes(vec3 pos) {
	return box(repeat(pos + vec3(0, 1, 0) * sin(floor(pos.x) + floor(pos.z) + time * 2.0) * 0.2, vec3(1.0, 2.0, 1.0)), vec3(0.3, 0.3, 0.3)) - 0.05;
}

float dist(vec3 pos) {
	return min(
		boxes(pos),
		pipe(pos));
}

vec3 getColor(vec3 pos)
{
	if (pipe(pos) < 0.001) return vec3(1, 0, 0.5);
	return vec3(0.2, 0.0, 0.4);
}
		   
vec3 getNormal(vec3 pos)
{
	float e = 0.0001;
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


void main( void ) {

	vec2 tex = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	mat3 rot = rotateX(time * 0.2) * rotateY(time * 0.5);
	vec3 pos = vec3(0, 0.0, mod(time, 100.0));
	vec3 dir = rot * normalize(vec3(tex, 0.5));
	
	vec3 color = vec3(1, 1, 1);
	
	for (float depth = 0.0; depth < 64.0; ++depth)
	{
		float d = dist(pos);
		pos += d * dir;
		if (d < 0.001)
		{
			vec3 normal = getNormal(pos);
			float light = max(dot(normal * rot, vec3(1, 1, -1) ), 0.0) + 0.3;
			color *= clamp(light * getColor(pos) + depth / 64.0, 0.0, 1.0);
			dir = reflect(dir, normal);
			pos += dir * 0.01;
		}
	}
	
	gl_FragColor = vec4(color, 1.0);

}