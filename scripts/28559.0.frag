#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec4 mouse;
uniform vec3 resolution;

const int		RAY_MARCHING_STEPS				= 256;
const float		RAY_MARCHING_EPSILON			= 0.0001;

const float 	AMBIENT_OCCLUSION_FALLOFF		= 0.5;
const int 		AMBIENT_OCCLUSION_STEPS 		= 5;

const int 		SOFT_SHADOW_STEPS 				= 50;

struct marchresult
{
	bool miss;
	vec3 color;
	vec3 normal;
	vec3 direction;
	vec3 hit;
};

vec3 getRay(vec3 eye, vec3 lookAt, vec2 uv)
{
	vec3 direction = normalize(lookAt - eye);
	vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), direction));
	vec3 up = cross(direction, right);
	
	return normalize(direction + right * uv.x + up * uv.y);
}

vec3 getRay(vec3 eye, float yaw, float pitch, vec2 uv)
{
	vec3 lookAt = vec3(sin(yaw), sin(pitch), -cos(pitch) * cos(yaw));
	
	return getRay(eye, lookAt, uv);
}

float distanceFromSphere(vec3 point, vec4 sphere)
{
	return distance(point, sphere.xyz) - sphere.w;
}

float distanceFromPlane(vec3 point, vec4 plane)
{
	return dot(point, plane.xyz) + plane.w;
}

float distanceFromWorld(vec3 point)
{
	float s = distanceFromPlane(point, vec4(0.0, 1.0, 0.0, 1.0)); 
	
	s = min(s, distanceFromSphere(point, vec4(-2.0, 0.0, -2.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(-2.0, 0.0, 0.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(-2.0, 0.0, 2.0, 1.0)));
	
	s = min(s, distanceFromSphere(point, vec4(0.0, 0.0, -2.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(0.0, 0.0, 0.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(0.0, 0.0, 2.0, 1.0)));
	
	s = min(s, distanceFromSphere(point, vec4(2.0, 0.0, -2.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(2.0, 0.0, 0.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(2.0, 0.0, 2.0, 1.0)));
	
	s = min(s, distanceFromSphere(point, vec4(-1.0, sqrt(2.0), -1.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(-1.0, sqrt(2.0), 1.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(1.0, sqrt(2.0), -1.0, 1.0)));
	s = min(s, distanceFromSphere(point, vec4(1.0, sqrt(2.0), 1.0, 1.0)));
	
	s = min(s, distanceFromSphere(point, vec4(0.0, 2.0 * sqrt(2.0), 0.0, 1.0)));
	
	return s;
}

vec3 getWorldNormal(vec3 point) {
	
	const float eps = RAY_MARCHING_EPSILON;
	
	float nx = distanceFromWorld(point + vec3(eps, 0.0, 0.0)) - distanceFromWorld(point + vec3(-eps, 0.0, 0.0));
	float ny = distanceFromWorld(point + vec3(0.0, eps, 0.0)) - distanceFromWorld(point + vec3(0.0, -eps, 0.0));
	float nz = distanceFromWorld(point + vec3(0.0, 0.0, eps)) - distanceFromWorld(point + vec3(0.0, 0.0, -eps));
	
	return normalize(vec3(nx, ny, nz));
}

vec2 getScreenUV(vec2 fragCoord)
{
	vec2 aspect = vec2(1.0, resolution.y / resolution.x);
	
	return (fragCoord.xy / resolution.xy + vec2(-0.5, -0.5)) * aspect;
}

vec4 marchRay(vec3 eye, vec3 dir)
{
	vec4 currentMarch = vec4(0.0);
	
	for(int i = 0; i < RAY_MARCHING_STEPS; i++)
	{
		currentMarch.xyz = eye + dir * currentMarch.w;
		
		float pointDistance = distanceFromWorld(currentMarch.xyz);
		
		if(pointDistance <= RAY_MARCHING_EPSILON) {
			
			return currentMarch;
		}
		
		currentMarch.w += pointDistance;
		
		if(currentMarch.w > 10000.0)
			break;
	}
	
	currentMarch.w = 10000.0;
	
	return currentMarch;
}

float getSoftShadowFactor(vec3 point, vec3 light)
{
	vec3 rd = normalize(light - point);
	vec3 ro = point;
	float maxt = distance(light, point);
	float t = 0.01;
    float res = 1.0;
	const float k = 3.0;
    for( int i = 0; i <  SOFT_SHADOW_STEPS; i++)
    {
        float h = distanceFromWorld(ro + rd*t);
        if( h<0.001)
            return 0.0;
		
		res = min( res, k*h/t );		
        t += h;
		
		if(t > maxt)
			return res;
    }
    return res;
}

float getSubsurfaceScatteringFactor(vec3 point, vec3 rayDirection)
{
	float total = 0.0;
	float weight = 3.0;
	
	for ( int i = 0; i < 15; ++i )
	{
		float delta = pow ( float(i) +1.0, 2.5 ) *0.01 *1.0;
		total += -weight *min ( 0.0, distanceFromWorld ( point + rayDirection * delta ) );
		weight *= 0.5;
	}
	return clamp ( 1.0 - total, 0.0, 1.0 );
}

float getAmbientOcclusionFactor(vec3 point, vec3 normal)
{
	float distance = 0.0;
	
	float occlusion = 0.0;
	float falloff = 1.0;
	
	for(int i = 1; i <= AMBIENT_OCCLUSION_STEPS; i++)
	{
		distance += AMBIENT_OCCLUSION_FALLOFF / float(AMBIENT_OCCLUSION_STEPS);
		
		float worldDistance = distanceFromWorld(point + normal * distance);
		float distanceDif = (abs(distance - worldDistance)) / AMBIENT_OCCLUSION_FALLOFF;
		occlusion += (1.0 / falloff) * distanceDif;
		falloff *= 2.0;
		
	}
	
	return 1.0 - occlusion;
}

vec3 shade(vec3 hit, vec3 rayDirection, vec3 normal, float depth)
{
	vec3 sunPos = vec3(30.0, 100.0, 120.0);
	vec3 sunDir = normalize(sunPos - hit);
	float ao = 0.5 + (0.5 * getAmbientOcclusionFactor(hit, normal));
	float softShadow = getSoftShadowFactor(hit, sunPos);
	float sssc = getSubsurfaceScatteringFactor(hit, rayDirection);
	vec3 materialColor = vec3(0.2, 0.25, 0.3);
	
	// compute materials
    vec3 material = materialColor;

    // lighting terms
    float sun = clamp( dot( normal, sunDir ), 0.0, 1.0 );
    float sky = clamp( 0.5 + 0.5*normal.y, 0.0, 1.0 );
    float ind = clamp( dot( normal, sunDir*vec3(-1.0,0.0,-1.0) ), 0.0, 1.0 );

	vec3 sunColor = vec3(1.64,1.27,0.99);
	
    // compute lighting
    vec3 lin  = sun*sunColor*pow(vec3(softShadow),vec3(1.0,1.2,1.5));
         lin += sky*vec3(0.16,0.20,0.28)*ao;
         lin += ind*vec3(0.40,0.28,0.20)*ao;

	lin+=sunColor * sssc;
	
    // multiply lighting and materials
    vec3 color = material * lin;
	//color = vec3(sssc);

    // gamma correction
    color = pow( color, vec3(1.0/2.2) );

    // display
    return vec3(color);	
}

marchresult marchAndShadeRay(vec3 origin, vec3 direction)
{
	vec4 marchResult = marchRay(origin, direction);
	
	vec3 hit = marchResult.xyz;
	marchresult result;
	
	if(marchResult.w >= 10000.0) {
		
		result = marchresult(true, vec3(0.0), vec3(0.0), vec3(0.0), vec3(0.0));
	}
	else
	{		
		vec3 normal = getWorldNormal(hit);	
		
		vec3 col = shade(hit, direction, normal, marchResult.w);
	
		result = marchresult(false, col, normal, direction, hit);
	}
	
	return result;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	vec2 uv = getScreenUV(fragCoord);
	vec2 mouse = (mouse.xy / resolution.xy + vec2(-0.5, -0.5));
	vec3 eye = vec3(sin(time) * 20.0, 5.0, cos(time) * 20.0);
	vec3 rayDirection = getRay(eye, vec3(0.0), uv);
	
	marchresult result = marchAndShadeRay(eye, rayDirection);
	
	fragColor = vec4(result.color, 1.0);
}