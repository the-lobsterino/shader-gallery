#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define EPSILON 0.000001

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float box(vec3 p, vec3 b, float r)
{
	return length(max(abs(p)-b,0.0))-r;
}

float sdSphere( vec3 p, float s )
{
  return length(p)-s;
}

float sdTorus( vec3 p, vec2 t )
{
  vec2 q = vec2(length(p.xz)-t.x,p.y);
  return length(q)-t.y;
}

float opU( float d1, float d2 )
{
    return min(d1,d2);
}

float opS( float d1, float d2 )
{
    return max(-d1,d2);
}

float scene(vec3 p)
{
	float global = box(p, vec3(0.8), 0.0);
	
	p.x += 2.0;
	global = opU(global, sdTorus(p, vec2(1.0, 0.3)));
	p.x -= 4.0;
	global = opU(global, sdSphere(p, 1.0));
	
	return global;
}

vec3 normal(vec3 p)
{
    return normalize(vec3(
        scene(vec3(p.x + EPSILON, p.y, p.z)) 	- scene(vec3(p.x - EPSILON, p.y, p.z)),
        scene(vec3(p.x, p.y + EPSILON, p.z)) 	- scene(vec3(p.x, p.y - EPSILON, p.z)),
        scene(vec3(p.x, p.y, p.z  + EPSILON)) 	- scene(vec3(p.x, p.y, p.z - EPSILON))
    ));
}


float march(vec3 ori, vec3 dir)
{
	const float maxd = 10.0;
	const float epsilon = 0.001;
	
	float d = 0.01;
	
	for (int i = 0; i < 100; i++)
	{
	    	float h = scene(ori + d*dir);
	    	if (h < epsilon)
		{
			// We're inside the scene surface!
			d += h/2.0;
			break;
	    	}
	    	d += h;
		if (d >= maxd)
		{
			//return -1.0;
		}
	    	// Move along the view ray
	}
	return d;
}

void main( void )
{

	float ratio = resolution.x/resolution.y;
	vec2 pixel = ( gl_FragCoord.xy / resolution.xy )*2.0-1.0;
	pixel.x *= ratio;
	
	// World
	vec3 camera = vec3(sin(time/2.0), 0.0*cos(time)+1.0, 3.0);
	vec3 center = vec3(0.0);
	vec3 light = normalize(vec3(1.0, 0.8, 0.3));
	
	// x -> Left , y -> up, z -> forward
	vec3 z = normalize(center-camera);
	vec3 x = cross(vec3(0.0, 1.0, 0.0), z);
	vec3 y = cross(z, x);
	
	// Init
	vec3 ray = normalize(z + pixel.x*x + pixel.y*y);
	vec3 color = vec3(0.0, 0.0, 0.4);
	
	// March
	float d = march(camera, ray);
	if (d >= 0.0)
	{
		vec3 hit = camera + d*ray;
		vec3 n = normal(hit);
		
		color = vec3(dot(light, n));
		color = vec3(d/10.0);
	}

	gl_FragColor = vec4(color, 1.0);

}