#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//Raymarcher to see cross sections of a 4D cube


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define stepLength 0.01

#define sphere false
#define ico true

#define numshades 15.

//#define WCOORDDIR pow(sin(time/10.), 3.)*1.3
#define WCOORDDIR 0.0
#define WCOORDPOS 0.0

#define TIMESCALE 0.2

#define ZPOS sin(time)*cameraDistance

#define cameraDistance 3.

#define MAXDEPTH 7.

bool xor(bool a, bool b)
{
	return (a || b) && !(a && b);
}
bool xZero(vec4 v, int c)
{
	int count = 0;
	count += abs(v.x)<0.01 ? 1 : 0;
	count += abs(v.y)<0.01 ? 1 : 0;
	count += abs(v.z)<0.01 ? 1 : 0;
	count += abs(v.w)<0.01 ? 1 : 0;
	return count == c;
}
float ndistance(vec4 a, vec4 b, float n)
{
	return pow(pow(a.x-b.x,n)+pow(a.y-b.y,n)+pow(a.z-b.z,n)+pow(a.w-b.w,n), 1./n);
}
bool cube(vec4 center, vec4 pos, float radius, float d)
{
	return ndistance(center, pos, d) <= radius;
}
vec4 getBiggestComponent(vec4 v)
{
	vec4 result = vec4(0.);
	if(abs(v.x) > abs(v.y) && abs(v.x) > abs(v.z) && abs(v.x) > abs(v.w))
		return vec4(sign(v.x), 0., 0., 0.);
	if(abs(v.y) > abs(v.z) && abs(v.y) > abs(v.w) && abs(v.y) > abs(v.x))
		return vec4(0., sign(v.y), 0., 0.);
	if(abs(v.z) > abs(v.w) && abs(v.z) > abs(v.x) && abs(v.y) > abs(v.y))
		return vec4(0., 0., sign(v.z), 0.);
	return vec4(0., 0., 0., sign(v.w));
}

vec3 rotate3d(vec3 r, float t, vec3 p)
{
	vec3 a = p * cos(t);
	vec3 b = cross(r, p)*sin(t);
	vec3 c = r*dot(r, p);
	return a + b + c*(1.0-cos(t));
}

float truncColor(float c)
{
	//return c;
	return floor(numshades * (c*0.5+0.5)) / numshades;
}

float raymarch(vec4 pos, vec4 direction)
{
	float depth = 0.0;
	direction = direction/length(direction);
	direction *= stepLength;
	
	vec4 light = vec4(sin(time)*5., cos(time)*5., sin(time)*5., 0.);
	vec4 lightNormal = normalize(light);
	
	for(float depth = 0.0; depth < MAXDEPTH; depth += stepLength)
	{
		pos += direction;
		
		if(ico && cube(vec4(0.), pos, 1., 10.))
			return dot(lightNormal, getBiggestComponent(pos)) > 0.99 ? 1. : truncColor(dot(lightNormal, getBiggestComponent(pos))) + 0.01;
		
		if(sphere && length(pos)<1.)
			return dot(light, getBiggestComponent(pos));
	}
	
	return 0.0;
}

vec3 getDirection(vec2 screenPos, vec3 position)
{
	vec3 up = vec3(0., 0., 1.);
	vec3 side = normalize(cross(up, position));
	vec3 cameraUp = cross(position, side);
	
	vec3 result = rotate3d(cameraUp, (screenPos.x-0.5), position);
	return rotate3d(side, (screenPos.y-0.5), result);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	// change the camera position here
	vec4 cameraPos = vec4(cos(time*TIMESCALE) * cameraDistance, sin(time*TIMESCALE) * cameraDistance, ZPOS, WCOORDPOS);
	
	// this ensures that the camera points towards (0,0,0) and then whatever the w coordinate is 
	vec4 direction = vec4(getDirection(p, -cameraPos.xyz), WCOORDDIR);
	
	float color = raymarch(cameraPos, direction);
	
	vec3 shade = vec3(color);
	
	if(color > 0.)
		shade += vec3(0.0, 0.1, 0.0);

	gl_FragColor = vec4( shade, 1.0 );

}