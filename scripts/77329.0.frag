#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float MAX_DISTANCE = 255.0;

float sphere(vec3 pos, vec3 p, float radius) 
{
	return length(p-pos) - radius;
}

float scene(vec3 p, float radius)
{
	float d = MAX_DISTANCE;
	float sn = 1.0;
	for(int i = 0; i < 2; ++i)
	{
		float fi = float(i);
		sn = -sn;		
		vec3 pos = vec3(sin(time * sn) * 2.0, cos(time)*2.0, -1.0);
		float s = sphere(pos, p, radius+float(i)*0.5);
		d = min(d, s);
	}
	return d;
}

float shootRay(vec3 eye, vec3 ray, float start, float end)
{
	float d = start;
	for(int i = 0; i < int(MAX_DISTANCE); ++i)
	{
		float dist = scene(eye + d * ray, 1.0);
		if(dist <= 0.001)
			return d;
		d += dist;
		if(d >= end)
			return end;
	}
	return end;
}

vec3 rayDirection(float fov, vec2 size, vec2 fragCoord) 
{
    vec2 xy = fragCoord - size / 2.0;
    float z = size.y / tan(radians(fov) / 2.0);
    return normalize(vec3(xy, -z));
}

void main( void ) 
{
	vec2 uv = gl_FragCoord.xy / resolution;
	uv -= vec2(0.5);
	float aspect = resolution.x / resolution.y;
	uv.x *= aspect;
	
	vec3 eye = vec3(0.0, 0.0, 5.0);
	
	vec3 ray = rayDirection(90.0, resolution, gl_FragCoord.xy);
	
	float d = shootRay(eye, ray, 0.0, 100.0);
	
	gl_FragColor = vec4(12.0/(d*d));
}