#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = atan(1.)*4.;

#define MAX_STEPS 48
#define HIT_DIST 0.001
#define MAX_DIST 10.0
#define EDGE_SHARPNESS 100.0
//#define VISUALIZE_STEPS

#define Union(a,b) min(a,b)
#define Subtract(a,b) max(-a,b)
#define Intersect(a,b) max(a,b)

struct Hit
{
	vec3 position;
	vec3 normal;
	vec3 color;
};

vec3 CameraPos = vec3(0,0,-2);

mat3 rotate(vec3 ang)
{
	mat3 rX = mat3(1,0,0,
		       0,cos(ang.x),-sin(ang.x),
		       0,sin(ang.x),cos(ang.x));
	mat3 rY = mat3(cos(ang.y),0,sin(ang.y),
		       0,1,0,
		       -sin(ang.y),0,cos(ang.y));
	mat3 rZ = mat3(cos(ang.z),-sin(ang.z),0,
		       sin(ang.z),cos(ang.z),0,
		       0,0,1);
	return rX*rY*rZ;
		       
}

//More distance functions can be found here: http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm

float Plane(vec3 normal,float dist,vec3 p)
{
	return dot(normal,p)+dist;
}

float Sphere(float rad,vec3 p)
{	
	return length(p)-rad;
}

float Cube(float rad,vec3 p)
{
	return max(max(abs(p.x),abs(p.y)),abs(p.z))-rad;
}

float Scene(vec3 pos)
{
	float scene = MAX_DIST;
	
	float back = -Cube(4.0,pos);
	
	float cube = Cube(0.25,pos);
	float sphere = Sphere(0.30,pos);
	float cornerClip = Sphere(0.40,pos);

	float hollow = Subtract(sphere,cube);
	hollow = Intersect(hollow, cornerClip);
	
	
	scene = Union(scene,hollow);
	scene = Union(scene,back);
	
	return scene;
}

vec3 Normal(vec3 pos)
{
	vec3 off = vec3(1.0/EDGE_SHARPNESS,0,0);
	vec3 norm;
	norm.x = Scene(pos + off.xyz)-Scene(pos - off.xyz);
	norm.y = Scene(pos + off.zxy)-Scene(pos - off.zxy);
	norm.z = Scene(pos + off.yzx)-Scene(pos - off.yzx);
	return normalize(norm);
}

Hit TraceRay(vec3 origin,vec3 directon)
{
	vec3 hitPos = origin;
	
	float hitDist = 0.0;
	float hitSteps = 0.0;
	
	for(int i = 0;i < MAX_STEPS;i++)
	{
		float sDist = Scene(hitPos); //Smallest distance from the scene at the current ray position
		
		if(sDist < HIT_DIST) 
		{
			break; //Stop the loop if the ray hits something
		}
		else
		{	
			hitDist += sDist; //Increment the current ray distance by the scene distance
			hitPos = origin + directon * hitDist; //Calculate the new ray position (origin + direction * distance)
			hitSteps++;
		}
	}
	Hit result;
	result.position = hitPos;
	result.normal = Normal(hitPos);
	result.color = vec3(abs(dot(result.normal, directon))) * (result.normal+1.0)*.5;
	
	#ifdef VISUALIZE_STEPS
	result.color = vec3(mix(vec3(0,1,0),vec3(1,0,0),hitSteps/float(MAX_STEPS)));
	#endif
	
	return result;
}

void main( void ) 
{
	vec2 res = vec2(resolution.x/resolution.y,1.0);
	vec2 p = ( gl_FragCoord.xy / resolution.y );
	
	vec2 ma = (mouse*2.0-1.0)*pi;
	ma.y = clamp(-ma.y,-pi/2.0,pi/2.0);
	
	vec3 CameraDir = normalize(vec3(p-res/2.0,0)-vec3(0,0,-0.9));
	
	mat3 CameraMat = rotate(vec3(ma.y,ma.x,0));
	
	CameraPos *= CameraMat;
	CameraDir *= CameraMat;
	
	Hit ray = TraceRay(CameraPos,CameraDir);
	
	vec3 color;
	
	color = ray.color;

	gl_FragColor = vec4( color , 1.0 );

}