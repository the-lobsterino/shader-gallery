#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct intersection
{
	float distance;
	vec3 normal;
	vec3 color;
	float reflectance;
};

intersection sphere (vec3 o, float r, vec3 c, vec3 p)
{
	vec3 d = p - o;
	float l = length(p - o);
	return intersection(l - r, d / l, c, 0.0);
}

intersection sphereMirror (vec3 o, float r, vec3 c, vec3 p)
{
	vec3 d = p - o;
	float l = length(p - o);
	return intersection(l - r, d / l, c, 0.5);
}

intersection plane (vec4 f, vec3 c, vec3 p)
{
	float d = dot(f.xyz, p) + f.w;
	return intersection(d, f.xyz, c, 0.0);
}

intersection planeMirror (vec4 f, vec3 c, vec3 p)
{
	float d = dot(f.xyz, p) + f.w;
	return intersection(d, f.xyz, c, 0.5);
}

intersection merge (intersection i1, intersection i2)
{
	if (i1.distance < i2.distance)
		return i1;
	else
		return i2;
}

intersection scene (vec3 p)
{
	intersection i = intersection(1.0/0.0, vec3(0.0,0.0,0.0), vec3(0.0,0.0,0.0), 0.0);
	
	i = merge(i, plane(vec4(0.0, 1.0, 0.0, 5.0), vec3(0.5, 1.0, 0.5), p));
	i = merge(i, plane(vec4(0.0, -1.0, 0.0, 5.0), vec3(0.5, 1.0, 0.5), p));
	i = merge(i, plane(vec4(1.0, 0.0, 0.0, 5.0), vec3(1.0, 0.5, 0.5), p));
	i = merge(i, plane(vec4(-1.0, 0.0, 0.0, 5.0), vec3(1.0, 0.5, 0.5), p));
	i = merge(i, plane(vec4(0.0, 0.0, -1.0, 15.0), vec3(0.5, 0.5, 1.0), p));
	i = merge(i, sphere(vec3(0.0, 1.0, 10.0), 1.0, vec3(1.0, 1.0, 1.0), p));
	i = merge(i, sphere(vec3(2.0, 2.0, 12.0), 1.0, vec3(1.0, 1.0, 0.0), p));
	i = merge(i, planeMirror(vec4(0.0, 1.0, 0.0, 0.5), vec3(1.0, 1.0, 1.0), p));
	i = merge(i, sphereMirror(vec3(sin(time*9999999.0), 3.0, 10.0), 1.0, vec3(1.0, 1.0, 1.0), p));
	return i;
}

vec3 raytrace (vec3 o, vec3 d)
{	
	float t = 0.0;
	
	vec3 result = vec3(0.0, 0.0, 0.0);
	float factor = 1.0;
	
	for (int depth = 0; depth < 4; ++depth)
	{
		intersection it;
		for (int i = 0; i < 200; ++i)
		{
			it = scene(o + d * t);
			if (it.distance < 0.01)
			{
				//return vec3(1.0, 1.0, 1.0);
				result += factor * it.color * max(0.4, dot(it.normal, vec3(1.0, 1.0, -1.0)));
				break;
			}
			t += it.distance;
		}
		if (it.reflectance == 0.0)
			break;
		
		result = result * (1.0 - it.reflectance);
		factor *= it.reflectance;
		
		o = o + d * t;
		d = d - 2.0 * it.normal * dot(d, it.normal);
		t = 0.0;
		o = o + d * 0.01;
	}
	
	return result;
}

void main( void ) {

	vec2 s = (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.y;
	
	gl_FragColor = vec4(raytrace(vec3(0.0, 0.0, 0.0), normalize(vec3(s.x, s.y, 1.0))), 1.0);
}