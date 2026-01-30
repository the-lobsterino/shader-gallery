#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MIN_DIST 0.000005
#define MAX_DIST 12.0
#define MAX_STEPS 196
#define STEP_MULT 1.0
#define NORMAL_OFFS 0.000001

float tau = atan(1.0) * 8.0;

struct MarchInfo
{
	int id;
	vec3 position;
	vec3 normal;
	float depth;
	float steps;
};

struct Camera
{
	vec3 position;
	vec3 angles;
};
	
struct Ray
{
	vec3 origin;
	vec3 direction;	
};

mat3 Rotate(vec3 angles)
{
    vec3 c = cos(angles);
    vec3 s = sin(angles);
    
    mat3 rotX = mat3( 1.0, 0.0, 0.0, 0.0,c.x,s.x, 0.0,-s.x, c.x);
    mat3 rotY = mat3( c.y, 0.0,-s.y, 0.0,1.0,0.0, s.y, 0.0, c.y);
    mat3 rotZ = mat3( c.z, s.z, 0.0,-s.z,c.z,0.0, 0.0, 0.0, 1.0);

    return rotX * rotY * rotZ;
}

vec2 opU( vec2 d1, vec2 d2 )
{
    return (d1.x < d2.x) ? d1 : d2;
}

vec2 opS( vec2 d1, vec2 d2 )
{
    return (-d1.x > d2.x) ? d1*vec2(-1,1) : d2;
}

vec2 opI( vec2 d1, vec2 d2 )
{
    return (d1.x > d2.x) ? d1 : d2;
}

vec2 opN( vec2 d )
{
	return d * vec2(-1,1);
}

vec2 sdSphere(int id, vec3 p, float r)
{
	return vec2(length(p)-r, id);
}

vec2 sdBox(int id, vec3 p, vec3 s)
{
	p = abs(p) - s / 2.0;
	return vec2(max(max(p.x,p.y),p.z), id);
}

vec2 sdPlane(int id, vec3 p, vec4 n)
{
  return vec2(dot(p, normalize(n.xyz)) + n.w, id);
}

vec2 Scene(vec3 p);

vec3 Normal(vec3 p)
{
    vec3 off = vec3(NORMAL_OFFS, 0, 0);
    return normalize( 
        vec3(
            Scene(p + off.xyz).x - Scene(p - off.xyz).x,
            Scene(p + off.zxy).x - Scene(p - off.zxy).x,
            Scene(p + off.yzx).x - Scene(p - off.yzx).x
        )
    );
}

Ray CameraRay(Camera cam, vec2 uv, vec2 res)
{
	uv -= res/2.0;
	Ray r;
	r.origin = cam.position;
	r.direction = normalize(vec3(uv.x, 0.7, uv.y)) * Rotate(cam.angles);
	
	return r;
}

MarchInfo MarchRay(Ray r)
{
	
	float dist = 0.0;
	float id = 0.0;
	
	float steps = 0.0;
	
	for(int i = 0;i < MAX_STEPS;i++)
	{
		vec2 sc = Scene(r.origin + r.direction * dist);
		
		dist += sc.x * STEP_MULT;
		id = sc.y;
		
		steps++;
		
		if(sc.x < MIN_DIST)
		{
			break;
		}
	}
	
	MarchInfo info;
	
	info.id = int(id);
	info.position = r.origin + r.direction * dist;
	info.normal = Normal(info.position);
	info.depth = dist;
	info.steps = steps;
	
	return info;
}

vec3 Shade(MarchInfo info, Camera cam, Ray ray);

void main( void ) 
{
	vec2 aspect = resolution / resolution.y;
	vec2 uv = gl_FragCoord.xy / resolution.y;
	
	Camera cam;
	
	vec3 angles = vec3(tau / 16.0, 0.0, time);
	
	cam.position = vec3(0,-1,0) * Rotate(angles);
	cam.angles = angles;
	
	Ray ray = CameraRay(cam, uv, aspect);
	
	MarchInfo info = MarchRay(ray);
	
	vec3 color = Shade(info, cam, ray);
	
	gl_FragColor = vec4( vec3( color ), 1.0 );

}

vec2 Scene(vec3 p)
{
	vec2 d = opN(sdSphere(0, p, MAX_DIST));
	
	vec2 box = opU(d,sdBox(1, p, vec3(0.25)));
	box = opS(sdSphere(1, p, 0.15), box);
	
	vec2 ground = sdPlane(2, p, vec4(0,0,1,0.125));
	
	d = opU(d, box);
	d = opU(d, ground);
	
	return d;
}

vec3 Shade(MarchInfo info, Camera cam, Ray ray)
{
	vec3 col = vec3(0);
	
	if(info.id == 0)
	{
		col = vec3(0.2);
	}
	
	if(info.id == 1)
	{
		col = info.normal * 0.5 + 0.5;
	}
	
	if(info.id == 2)
	{
		col = vec3(step(0.0, cos(info.position.x*tau*2.0) * cos(info.position.y*tau*2.0)) * 0.25 + 0.5);
	}
	
	col *= dot(-ray.direction, info.normal);
	
	return col;
}
