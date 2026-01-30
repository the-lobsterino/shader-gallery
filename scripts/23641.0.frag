#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


// -------------------------------------------------------------------------------------------------------------------------
float rand(vec2 v2)
{
	// 0.0 .. 1.0
	return fract(sin(dot(v2.xy *10000.0, vec2(12.9898, 78.233))) * 43758.5453);
}

float spere(vec3 ray_start, vec3 ray_dir, vec3 center, float radius)
{
	vec3 oc = ray_start - center;
	float B = dot(ray_dir, oc);
	float C = dot(oc, oc) - radius * radius;
	float f = B * B - C;
	if(f < 0.0)
	{
		return 0.0;
	}
	else
	{
		float d = min(-B + sqrt(f), -B - sqrt(f));
		if(d < 0.0)
		{
			return 0.0;
		}
		else
		{
			return d;
		}
	}
}

float plane()
{
	return 0.0;
}

float triangle()
{
	return 0.0;
}

// -------------------------------------------------------------------------------------------------------------------------
void main( void )
{
	// -1.0 .. 1.0
	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * 2.0;
	float a = resolution.x / resolution.y;
	position.x *= a;
	
	// view
	vec3 ray_start = vec3(0.0, 0.0, -3.0);
	vec3 ray_at = normalize(vec3(position, 1.0));
	
	// sphere
	vec3 center = vec3(0.0, 0.0, 0.0);
	float radius = 1.0;
	float d = spere(ray_start, ray_at, center, radius);
	vec3 n = normalize((ray_start + ray_at * d) - center);
	
	if(d > 0.0)
	{
		vec3 d_light_dir = normalize(vec3(-1.0, -1.0, 0.5));
		float light = min(dot(n, -d_light_dir) + 0.25, 1.0);
		float r = rand(position);
		vec3 color = vec3(light * r);
		gl_FragColor = vec4(color, 1.0);
	}
	else
	{
		
	}
}

