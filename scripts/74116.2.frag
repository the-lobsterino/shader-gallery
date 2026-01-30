#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float smin(float a, float b, float r)
{
	float e = (max(r - abs(a - b), 0.0));
        return min(a, b) - e * e * 0.25 / r;
}

float sdSphere(vec3 p, vec3 c, float r)
{
	return distance(p, c) - r;
}

float scene(vec3 p)
{
	float sd = 1e20;
	
	float s0 = sdSphere(p, vec3(0.0, 0.0, 0.0), 0.25);
	float s1 = sdSphere(p, vec3(0.2*sin(time*2.0)*3.0, 0.0, 0.1), 0.1);
	float s2 = sdSphere(p, vec3(0.0, 0.2*sin(time*2.0)*3.0, 0.1), 0.1);
	sd = smin(s0, s1, 0.2);
	sd = smin(sd, s2, 0.2);
	
	return sd - length(sin(p*40.0))*0.01;
}

vec3 gradScene(vec3 p)
{
	const float EPS = 0.001;
	vec3 a = vec3(
		scene(vec3(p.x+EPS, p.y, p.z)),
		scene(vec3(p.x, p.y+EPS, p.z)),
		scene(vec3(p.x, p.y, p.z+EPS))
	);
	vec3 b = vec3(
		scene(vec3(p.x-EPS, p.y, p.z)),
		scene(vec3(p.x, p.y-EPS, p.z)),
		scene(vec3(p.x, p.y, p.z-EPS))
	);
	return (a-b)/(2.0*EPS);
	
}

void main( void ) 
{
	vec3 sunDir = normalize(vec3(1.0, 1.0, 1.0));
	
	float ar = resolution.x / resolution.y;
	vec2 p = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	p.x *= ar;
	vec2 m = mouse.xy * 2.0 - 1.0;
	m.x *= ar;
	
	vec3 rayPos = vec3(0.0, 0.0, 1.0);
	vec3 rayDir = normalize(vec3(p.x, p.y, -2.0));
	
	for (int i = 0; i<64; i++)
	{
		float sd = scene(rayPos);
		
		if (abs(sd) < 0.001)
		{
			vec3 N = normalize(gradScene(rayPos));
			gl_FragColor = vec4(vec3(dot(N, sunDir))+rayDir-N, 1.0);
			return;
		}
		
		rayPos += rayDir * sd;
	}
	
	gl_FragColor = vec4( rayDir, 1.0 );
}