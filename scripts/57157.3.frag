precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define STEPS 256
#define MAX_DISTANCE 100.0
#define SURFACE_DISTANCE 0.01

float SDCapsule(vec3 point, vec3 a, vec3 b, float radius)
{
	vec3 ab = b-a;
	vec3 apoint = point-a;

	float t = dot(ab, apoint) / dot(ab, ab);
	t = clamp(t, 0.0, 1.0);

	vec3 c = a + t * ab;
	return length(point - c) - radius;
}

float SDTorus(vec3 p, vec2 r)
{
	float x = length(p.xz) - r.x;
	return length(vec2(x, p.y)) - r.y;
}

float DBox(vec3 p, vec3 size)
{
	return length(max(abs(p)-size, 0.0));
}

float DCylinder(vec3 point, vec3 a, vec3 b, float radius)
{
	vec3 ab = b-a;
	vec3 apoint = point-a;

	float t = dot(ab, apoint) / dot(ab, ab);
	//t = clamp(t, 0.0, 1.0);

	vec3 c = a + t * ab;
	float x = length(point - c) - radius;
	float y = (abs(t - 0.5) - 0.5) * length(ab);
	float exteriorLength = length(max(vec2(x, y), 0.0));
	float interiorDistance = min(max(x,y), 0.0);

	return exteriorLength + interiorDistance;
}

float opUnion( float d1, float d2 )
{
    return min(d1,d2);
}

float opSubtraction( float d1, float d2 )
{
    return max(-d1,d2);
}

float opIntersection( float d1, float d2 )
{
    return max(d1,d2);
}

float opSmoothUnion( float d1, float d2, float k )
{
	float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
	return mix( d2, d1, h ) - k*h*(1.0-h);
}

float opSmoothSubtraction( float d1, float d2, float k )
{
	float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
	return mix( d2, -d1, h ) + k*h*(1.0-h);
}

float opSmoothIntersection( float d1, float d2, float k )
{
	float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
	return mix( d2, d1, h ) + k*h*(1.0-h);
}

float GetDistance(vec3 point)
{
	vec4 sphere = vec4((4.0 + ((2.+sin(time/2.)*.2 * 0.3 * 5.01)-7.0)), 1.0, 10.0 + ((0.1 * 8.01)-5.0), 1.0);
	
	float sphereDistance = length(point-sphere.xyz)-sphere.w;
	float planeDistance = point.y;
	
	float capsuleDistance = SDCapsule(point-vec3(-3.0, -0.6, 3.0), vec3(0, 1, 6), vec3(0, 2, 6), 0.5);
	float torusDistance = SDTorus(point-vec3(0.0, 0.2, 12), vec2(1.5, 0.3));
	float boxDistance = DBox(point-vec3(-3.0, 0.5, 6.0), vec3(0.5));
	float cylinderDistance = DCylinder(point-vec3(-0.0, -1.0, 0.0), vec3(0, 1, 6), vec3(0, 3, 6), 0.5);

	float theDistance = min(capsuleDistance, planeDistance);
	float sphereCapsuleUnion = opSmoothUnion(sphereDistance, capsuleDistance, 1.0);
	float sphereTorusUnion = opSmoothUnion(sphereDistance, torusDistance, 0.8);
	float sphereBoxSubst = opSmoothUnion(sphereDistance, boxDistance, 1.5);
	float sphereCylIntersect = opSmoothUnion(sphereDistance, cylinderDistance, 0.5);

	theDistance = min(theDistance, sphereTorusUnion);
	theDistance = min(theDistance, sphereCapsuleUnion);
	theDistance = min(theDistance, sphereBoxSubst);
	theDistance = min(theDistance, sphereCylIntersect);
	return theDistance;
}

float RayMarch(vec3 rayOrigin, vec3 rayDir)
{
	float origin = 0.0;
	for(int i = 0; i < STEPS; i++)
	{
		vec3 currentMarchingLoc = rayOrigin + rayDir * origin;
		float sceneDist = GetDistance(currentMarchingLoc);
		origin += sceneDist;
		if(origin > MAX_DISTANCE || sceneDist < SURFACE_DISTANCE)
		{
			break;
		}
	}
	
	return origin;
}

vec3 GetNormal(vec3 point)
{
	float dist = GetDistance(point);
	vec2 e = vec2(0.01, 0);
	
	vec3 normal = dist - vec3(
		GetDistance(point-e.xyy),
		GetDistance(point-e.yxy),
		GetDistance(point-e.yyx)
	);
	
	return normalize(normal);
}

float GetLight(vec3 point)
{
	vec3 lightPosition = vec3(0, 5, 6);
	lightPosition.xz += vec2(sin(time)*3.0, cos(time)*3.0);
	vec3 lightVec = normalize(lightPosition-point);
	vec3 normal = GetNormal(point);
	
	float diffuse = clamp(dot(normal, lightVec), 0.0, 1.0);
	float d = RayMarch(point + normal * SURFACE_DISTANCE * 2.0, lightVec);
	if(d < length(lightPosition-point)) 
	{
		diffuse *= 0.1;
	}
	return diffuse;
}

void main(void) {

	vec2 position = ( gl_FragCoord.xy - 0.5 * resolution.xy ) / resolution.y;

	vec3 color = vec3(0.2, 0.2, 0.65);
	
	vec3 camera = vec3(0, 5, -2.0);
	vec3 rayDir = normalize(vec3(position.x, position.y-0.4, 1.0));
	
	float theDistance = RayMarch(camera, rayDir);
	
	vec3 point = camera + rayDir * theDistance;
	
	float diffuseLight = GetLight(point);
	
	color = vec3(diffuseLight);
	color *= vec3(1.1,1.1,1.1);
	
	color.x = color.y;
	color.z = color.x;
	
	gl_FragColor = vec4(color*1.9, 1.0);
}