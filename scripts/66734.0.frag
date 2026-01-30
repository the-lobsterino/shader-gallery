// 090820N

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define MIN_DIST (.5/max(resolution.x, resolution.y))
#define MAX_DIST 3.0
#define MAX_STEPS 256
#define STEP_MULT 1.
#define NORMAL_OFFS (MIN_DIST)

#define PERSPECTIVE 0
#define ISOMETRIC 1

#define PROJECTION_MODE PERSPECTIVE

float tau = atan(0.5) * 8.0;

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

vec2 opRep(vec2 p,vec2 r)
{
	return mod(p + r,2.0 * r) - r;	
}

vec3 opRep(vec3 p,vec3 r)
{
	return mod(p + r,2.0 * r) - r;	
}

vec2 opN( vec2 d )
{
	return d * vec2(-1,1);
}

vec3 opAngRep( vec3 p, float a, float off)
{
	vec2 polar 	= vec2(atan(p.y, p.x), length(p.xy));
    	polar.x 	= mod(polar.x + a / 2.0 + off, a) - a / 2.0;
    
    	return vec3(polar.y * vec2(cos(polar.x),sin(polar.x)), p.z);
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

vec2 sdPole(int id, vec3 p, float s)
{
    return vec2(length(p.xy) - s, id);
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
	mat3 rot = mat3(0);
	 
	
	rot = Rotate(cam.angles);
	r.origin = cam.position;
	r.direction = normalize(vec3(uv.x, 1.0, uv.y)) * rot;
	
	 
	
	return r;
}

MarchInfo MarchRay(Ray r)
{	
	float dist = 0.0;
	float id = 0.0;
	
	float steps = 0.0;
	
	for(int i = 0;i < 5;i++)
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
	vec2 aspect 	= resolution / resolution.y;
	vec2 uv 	= gl_FragCoord.xy / resolution.y;
	
	Camera cam;
	
	vec3 angles 	= vec3(tau / 8.0, 0.0, 0.);
	
	cam.position 	= vec3(0,-.75,-.125) * Rotate(angles);
	cam.angles 	= angles;
	
	Ray ray 	= CameraRay(cam, uv, aspect);
	
	MarchInfo info 	= MarchRay(ray);
	
	vec3 color 	= Shade(info, cam, ray);
	
	gl_FragColor 	= vec4( vec3( color ), 1.0 );
}


mat2 Rotate(float t)
{
	float c = cos(t);
	float s = sin(t);
	
	return mat2(c, s, -s, c);	
}

vec2 Scene(vec3 p)
{	
	//params
	float segments  		= 7.;					
	float sides	  		= 15.;						
	float twists			= 8.;
	float radius 			= .35;
	float thickness			= .05;	
	
	
	//torus 
	float rotation			= sin(time*0.1)*tau; // mouse.x * tau;				//rotation around axis
	float tau_segments		= tau / segments;				//the number of divisions must sum to a multiple of tau for them to line up around the ring without discontinuities - it gets divided by tau down below				
	float tau_sides			= tau / sides;					//tau == 2. * pi

	float angle_from_origin		= (p.y * p.x);	
	float twist_rotation		= twists * (angle_from_origin + rotation)/sides; //this must share factors with the sides, else you might get discontinuities - including the rotation keeps it aligned		
	
	p				= opAngRep(p, tau_segments, rotation); 		//mirror this point p in space around the around the vertical axis like a kaleidoscope (tau == 2 PI	
	p.x				-= radius;					//shift it away from the center					
	p.yz				= p.zy;						//rotate y so it points along the ring instead of up (replace this line with "p.yz *= Rotate(mouse.x*6.28);" to see whats goin on) 
	p				= opAngRep(p, tau_sides, twist_rotation);	//mirror it again, now along the direction around what will be the torus
	
	
	float torus 			= p.x - thickness;
	float material_id 		= 1.;	
	
	return vec2(torus, material_id);;
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
	
	col *= 1.0-(info.steps / float(MAX_STEPS));
	
	float falloff = 0.5 / pow(length(cam.position - info.position),2.0);
	
	float ambient = 0.0;
	float diffuse = max(0.0, dot(info.normal,  normalize(cam.position - info.position)));
	float specular = 1.0; // max(0.0,-dot(reflect(ray.direction, info.normal), ray.direction));
	
	col *= vec3(1.0,0.8,0.6) * (ambient + (diffuse + 1.8*pow(specular,8.0)) * falloff);
	
	return col;
}
