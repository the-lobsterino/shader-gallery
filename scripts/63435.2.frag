#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int MAX_STEPS = 18;
const float MAX_DIST = 4.0;
const float MIN_DIST = 0.05;

struct Sphere
{
	vec3 pos;
	float radius;
};

float GetDist(in vec3 point)
{
	Sphere s = Sphere(vec3(0.0, sin(time)*0.5+1.0, 6.0), 1.0);
	
	float ds = length(s.pos - point)-s.radius;
	float dp0 = point.y;
	float cube = length(max(abs(point-vec3(2,1,5))-vec3(.4), 0.0));
	
	return min(min(ds, dp0), cube);
}

vec3 GetNormal(in vec3 point)
{
	const vec2 e = vec2(0.01, 0.0);
	float d = GetDist(point);
	vec3 normal = d - vec3(
		GetDist(point+e.xyy),
		GetDist(point+e.yxy),
		GetDist(point+e.yyx)
	);
	
	return normalize(normal);
}

float CalculateLight(in vec3 point)
{
	vec3 l0 = vec3(cos(time), -2., 6.0);
	
	vec3 normal = GetNormal(point);
	vec3 lightDir = normalize(l0 - point);
	
	return dot(normal, lightDir);
}

float RayMarch(vec3 rayOrigin, vec3 rayDirection)
{
	float distToOrigin = 0.0;
	for (int i = 0; i < MAX_STEPS; i++)
	{
		vec3 p = rayOrigin + rayDirection*distToOrigin;
		float d = GetDist(p);
		distToOrigin += d;
		
		if (d > MAX_DIST || d < MIN_DIST) break;
	}
	
	return distToOrigin;
}

void main()
{
	vec2 uv = (gl_FragCoord.xy-resolution.xy*0.5) / resolution.y;

	float dist = RayMarch(vec3(0, 1, 0), vec3(uv.xy, 1.0));
	float color = CalculateLight(vec3(0, 1, 0) + dist * vec3(uv.xy, 1.0));
	
	gl_FragColor = vec4(color);
}










