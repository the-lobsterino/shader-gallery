#ifdef GL_ES
precision mediump float;
#endif

// dashxdr 20151110

varying vec2 surfacePosition;
uniform float time;
#
vec3 color = vec3(0.0);
vec3 dir, eye, lookat;
float dist = 9999.0;
bool side = false;
vec2 spinu, spinv;
vec3 tracecolor;

void closer(float d)
{
	if(d<dist)
	{
		dist = d;
		color = side ? tracecolor*.5 : tracecolor;
	}
}

bool yinyang(vec2 p)
{
	p = vec2(dot(p, spinu), dot(p, spinv));
	float r = length(p);
	if(r>1.0) return false;
	float d1 = length(p - vec2(0.5, 0.0));
	float d2 = length(p - vec2(-0.5, 0.0));
	float smallr = 0.15;
	if(d1<smallr) return false;
	if(d1<0.5) return true;
	if(d2<smallr) return true;
	if(d2<0.5) return false;
	if(p.y>0.0) return true;
	return false;
}

float lastd;
bool yinyangplane(float h)
{
	float m = (eye.z - h) / -dir.z;
	vec2 p = eye.xy + m*dir.xy;
	lastd = length(eye - vec3(p, h));
	return yinyang(p);
}

void trace(float tt, vec2 pos, float flip)
{
	vec3 upDirection = vec3(0.0, 1.0, 0.0);
	vec3 cameraDir = normalize(lookat - eye);
	vec3 cameraRight = normalize(cross(cameraDir, upDirection));
	vec3 cameraUp = cross(cameraRight,cameraDir);
	dir = normalize(cameraRight * pos.x + cameraUp * pos.y + 1.5 * cameraDir);

	spinu.x = flip*cos(tt);
	spinu.y = -flip*sin(tt);
	spinv.x = -flip*spinu.y;
	spinv.y = flip*spinu.x;

	side = false;
	float upper = .025;

	bool hit_upper = yinyangplane(upper);
	float upperd = lastd;
	if(hit_upper)
	{
		closer(upperd);
		return;
	}
	float lower = -upper;
	bool hit_lower = yinyangplane(lower);

	float centerd=dist;
#define STEPS 16
	for(int i=0;i<=STEPS;++i)
	{
		float center = mix(upper, lower, float(i)/float(STEPS));
		bool hit_center = yinyangplane(center);
		if(hit_center) {if(lastd<centerd) centerd = lastd;side=true;}
	}
	closer(centerd);
}

void main()
{
	vec2 pos = surfacePosition * 2.0;

	float tt = time*3.1;

	vec2 rot;
	float downa;

	float zoom = 1.3;

	eye = zoom*vec3(0.5, 1.0, 1.0);
	lookat = vec3(0.0);
	tracecolor = vec3(1.0, 1.0, 1.0);
	trace(tt, pos, 1.0);

	tt = -tt;
	eye = zoom*vec3(0.5, -1.0, 1.0);
	tracecolor = vec3(0.0, 0.0, 1.0);
	trace(tt, pos, -1.0);

	gl_FragColor =  vec4(color, 1.0);
}