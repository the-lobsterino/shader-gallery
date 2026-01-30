// zw
// 2016
//

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define STEPS 64
#define MIN_DISTANCE 0.001
#define PI 3.141592653589793238486

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

struct Ray
{
    vec3 vOrigin;
    vec3 vDir;
};

// Polar Repeat function by Mercury
void pModPolar(inout vec2 p, float repetitions) 
{
	float angle = PI / repetitions;
	float a2 = 2.0 * angle;
	float a = atan(p.y, p.x) + angle;
	float r = length(p);
	float c = floor(a / a2);
	a = mod(a,a2) - angle;
	p = r * vec2(cos(a), sin(a));
}
	
float vmax(vec3 v)
{
	return max(max(v.x, v.y), v.z);
}

float sdf_sphere (vec3 p, vec3 c, float r)
{
    return distance(p,c) - r;
}

float sdf_torus( vec3 p, vec3 c, vec2 t )
{
	p += c;
	return length( vec2(length(p.xz)-t.x,p.y) )-t.y;
}


float sdf_boxcheap(vec3 p, vec3 c, vec3 s)
{
	return vmax(abs(p-c) - s);
}

float sdf_blend(float d1, float d2, float a)
{
	return a * d1 + (1.0 - a) * d2;
}

float sdf_smin(float a, float b, float k)
{
	float res = exp(-k*a) + exp(-k*b);
	return -log(max(0.0001,res)) / k;
}
	
float searchScene (vec3 p)
{
	
	vec3 pMod = p;
	float modSize = 0.42;// + sin(p.x*10.0)*.2;
	
	pMod.x += sin(p.y*3.0)*.1;
	pMod.x = mod(pMod.x, modSize)-modSize*.5;
	pMod.y = mod(p.y, modSize)-modSize*.5;
	
	
	pMod.z += sin(p.y*2.0+p.x+time)*.2;
	
	
	pModPolar(pMod.xz, 5.0);


	float a = sdf_smin
		(
		sdf_sphere(p, vec3(sin(time)*.4), .2),
		sdf_boxcheap(pMod, vec3(.0), vec3(0.05, 0.15, 0.05)),
		16.0
		);
	
	
	
	
	a = sdf_smin
		(
		sdf_sphere(p, vec3(sin(time), -0.3, 0.0), .15),
		a,
		16.0
		);
	
		
	a = sdf_smin
		(
		sdf_torus(p, vec3(0.0,sin(time)*.55, 0.0), vec2(0.35+sin(time)*.1, 0.1+sin(time*2.)*0.05)),
		a,
		16.0
		);
	
	return a;
}

vec3 normal (vec3 p)
{
	const float eps = 0.005;

	return normalize
	(	vec3
		(	searchScene(p + vec3(eps, 0., 0.)	) - searchScene(p - vec3(eps, 0., 0.)),
			searchScene(p + vec3(0., eps, 0.)	) - searchScene(p - vec3(0., eps, 0.)),
			searchScene(p + vec3(0., 0., eps)	) - searchScene(p - vec3(0., 0., eps))
		)
	);
}

vec3 simpleLambert (vec3 pos) {
	
	
	vec3 norm = normal(pos);
	
	vec3 lightDir = vec3(-0.5, 1.0, -0.5);
	vec3 lightCol = vec3(0.7, 0.9, 1.0);

	float NdotL = max(dot(norm, lightDir),0.0);
	vec3 c = lightCol * NdotL;
	
	lightDir = vec3(0.5, -0.25, 0.5);
	lightCol = vec3(1.5, 0.6, 0.0);

	NdotL = max(dot(norm, lightDir),0.0);
	c += lightCol * NdotL;
	
	c += vec3(0.0, 0.1, 0.0);
	
	/*
	vec3 aoSamplePos = pos+norm*.1;
	float occlusion =0.0;
	
	for(int i=0; i<4; i++)
	{
		float distance = searchScene(aoSamplePos);
				 	
		aoSamplePos += norm*.1;
		
		occlusion += something;
	}	
	*/
	
	return c;
}

vec3 raymarch (vec3 position, vec3 direction)
{
	float distMarched = 0.0;
	
	for (int i = 0; i < STEPS; i++)
	{
		float distance = searchScene(position);
		if (distance < MIN_DISTANCE)
			return simpleLambert(position) - vec3(distMarched*.1);
			//return vec3(1.0, 0.0, 0.0);
		 	
		position += distance * direction;
		distMarched += distance;
	}
	return vec3(0.0);
}

Ray cameraRay( const in vec3 vPos, const in vec3 vForwards, const in vec3 vWorldUp)
{
	vec2 vPixelCoord = gl_FragCoord.xy;
	vec2 vUV = ( vPixelCoord / resolution.xy );
	vec2 vViewCoord = vUV * 2.0 - 1.0;
	
	float fRatio = resolution.x / resolution.y;
	
	vViewCoord.y /= fRatio;  
	
	Ray ray;
	
	ray.vOrigin = vPos;
	
	vec3 vRight = normalize(cross(vForwards, vWorldUp));
	vec3 vUp = cross(vRight, vForwards);
	
	ray.vDir = normalize( vRight * vViewCoord.x + vUp * vViewCoord.y + vForwards); 
	return ray;
}
 
Ray cameraRayLookat( const in vec3 vPos, const in vec3 vInterest)
{
	vec3 vForwards = normalize(vInterest - vPos);
	vec3 vUp = vec3(0.0, 1.0, 0.0);
	
	return cameraRay(vPos, vForwards, vUp);
}

void main( void ) {
	
	//move to global?
	vec3 cameraPos = vec3(0.0);
	cameraPos.x = sin(time*.3);
	cameraPos.z = cos(time*.3);
	cameraPos.y = 1.0;
	
	
	Ray ray = cameraRayLookat( cameraPos, vec3(0.0));
	

	vec3 color = raymarch(ray.vOrigin, ray.vDir);

	gl_FragColor = vec4(color, 1.0);
	//gl_FragColor = vec4(screenPos.x, screenPos.y, 0.0, 1.0);

}