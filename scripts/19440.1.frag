#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int iters = 1024;

const float origin_z = 0.0;
const float plane_z = 8.0;
const float far_z = 256.0;

const float step = (far_z - plane_z) / float(iters) * 0.025;

const float color_bound = 0.0;
const float upper_bound = 1.0;

const float scale = 64.0;

const float disp = 0.25;

float calc_this(vec3 p, float disx, float disy, float disz)
{
	float t = time * 0.1;
	float c = sin(sin((p.x + disx) * sin(sin(p.z + disz)) + t) + sin((p.y + disy) * cos(p.z + disz) + 2.0 * t) + sin(3.0*p.z + disz + 3.5 * t) + sin((p.x + disx) + sin(p.y + disy + 2.5 * (p.z + disz - t) + 1.75 * t) - 0.5 * t));
	return c;
}

vec3 get_intersection()
{
	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * scale;

	vec3 pos = vec3(position.x, position.y, plane_z);
	vec3 origin = vec3(0.0, 0.0, origin_z);

	vec3 dir = pos - origin;
	vec3 dirstep = normalize(dir) * step;

	dir = normalize(dir) * plane_z;


	float c;

	for (int i=0; i<iters; i++)
	{
		c = calc_this(dir, 0.0, 0.0, 0.0);

		if (c > color_bound)
		{
			break;
		}

		dir = dir + dirstep;
	}

	return dir;
}

float f(vec3 p)
{
	return calc_this(p, 0.0, 0.0, 0.0);
}

float lighting0(vec3 p, vec3 l)
{
	float dx = color_bound - calc_this(p, disp, 0.0, 0.0);
	float dy = color_bound - calc_this(p, 0.0, disp, 0.0);

	vec3 du = vec3(disp, 0.0, dx);
	vec3 dv = vec3(0.0, disp, dy);
	vec3 normal = normalize(cross(du, dv));

	float d = dot(normal, l);
	return d;
}


float lighting1(vec3 p, vec3 l)
{
	vec3 n;
	vec3 e=vec3(1.0,0,0);
	n.x=f(p)-f(p+e.xyy);
	n.y=f(p)-f(p+e.yxy);
	n.z=f(p)-f(p+e.yyx);
	n = normalize(n);
	float d=dot(n,l);
	return d;
}

float lighting2(vec3 p, vec3 l)
{
	float d=f(p+0.1*l);
	return d;
}


void main()
{
	vec3 p = get_intersection();

	
	float l = (lighting0(p, vec3(0.0, 0.0, 1.0)) + lighting1(p, vec3(0.0, 0.0, 1.0)) + lighting2(p, vec3(0.0, 0.0, 1.0))) * 0.5;
	float cc = pow(l, 2.0);
	gl_FragColor = vec4(cc*0.2, cc*0.5, cc*4.8, cc) * (16.0 / p.z);
}
