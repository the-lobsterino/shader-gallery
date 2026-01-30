#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float epsilon = 1e-6;
const float PI = 3.14159265358979323846;
const float pov = PI/10.0;
const float delta = 0.001;
const float maxdistance = 5.0;
vec3 light = vec3(1.0, 2.0, 3.0);
float c = cos(time);
float s = sin(time);
float tilt = -PI/ 10.0;

float udRoundBox( vec3 p, vec3 b, float r )
{
  return length(max(abs(p)-b,0.0))-r;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float myobj(vec3 p)
{
	p *= mat3(c, 0.0, -s,
	          0.0, 1.0, 0.0,
		      s, 0.0, c);
	
	float d1 = p.y + 0.6;
	float d2 = udRoundBox(p+vec3(0.6,0.0,0.0), vec3(0.4, 0.4, 0.4), 0.2);
	float d3 = sdSphere(p+vec3(-0.6,0.0,0.0), 0.6);
	return min(min(d1, d2),d3);
}

float occulusion(vec3 pos, vec3 normal)
{
	const float step = 0.02;
	float total = 0.0;
	float weight = 0.5;
	for (int i = 1; i <= 5; ++i)
	{
		float d1 = step * float(i);
		float d2 = myobj(pos + normal * d1);
		total += weight * (d1 - d2);
		weight *= 0.5;
	}
	
	return clamp(1.0 - 24.0 * total, 0.0, 1.0);
}

void main(void)
{
	float ar = resolution.x / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y - vec2(0.5 * ar, 0.5);
	
	vec3 eye = vec3(0.0, 1.0, 3.5);
	vec3 ray = normalize(vec3(uv, 4.0 - 0.5/atan(pov)) - vec3(0.0, 0.0, 4.0));
	ray = ray * mat3(1.0, 0.0, 0.0,
		  	  	     0.0, cos(tilt), -sin(tilt),
					 0.0, sin(tilt), cos(tilt));
	vec3 light = normalize(vec3(1.0, 2.0, 3.0));
	vec3 lightColor = vec3(1.0, 1.0, 1.0);
	
	vec3 color = vec3(0.0);
	float t = 0.0;
	for (int i  = 0; i < 128; ++i)
	{
		vec3 p = eye + ray * t;
		float d = myobj(p);
		if(abs(d) < epsilon)
		{
			float nx = myobj(vec3(p.x+delta, p.y, p.z)) - myobj(vec3(p.x-delta, p.y, p.z));
			float ny = myobj(vec3(p.x, p.y+delta, p.z)) - myobj(vec3(p.x, p.y-delta, p.z));
			float nz = myobj(vec3(p.x, p.y, p.z+delta)) - myobj(vec3(p.x, p.y, p.z-delta));
			vec3 normal = normalize(vec3(nx, ny, nz));
			color = lightColor * 0.5 * dot(normal, light);
			float o = occulusion(p, normal);
			color += lightColor * 0.5 * o;
			break;
		}
		t += d;
		if (t > maxdistance)
			break;
	}
	
	gl_FragColor = vec4(color, 1.0);
}
