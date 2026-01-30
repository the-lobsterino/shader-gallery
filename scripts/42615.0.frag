#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
//Inspiration: http://9bitscience.blogspot.fi/2013/07/raymarching-distance-fields_14.html

//Variables provided by glslsandbox.com
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//Maxium number of steps to make
const int maxSteps = 64;
//Minumun distance to surface.
const float distanceThreshold = 0.00005;
//Maximum distance of ray
const float oblivion = 30.0;

float aspectRatio = resolution.y / resolution.x;

//Distance functions to creat primitives to 3D world
//Source http://www.iquilezles.org/www/articles/distfunctions/distfunctions.htm
float sdSphere(vec3 p, float radius, bool multiple)
{
	if(multiple == true) 
	{
		p.x = mod(p.x, 3.0) - 1.5;
    		p.z = mod(p.z, 3.0) - 1.5;
	}
	
    	return length(p) - radius;
}

float sdBox(vec3 p, vec3 b, bool multiple)
{	
	if(multiple == true) 
	{
		p.x = mod(p.x, 3.0) - 1.5;
    		p.z = mod(p.z, 3.0) - 1.5;
	}
  	return length(max(abs(p)-b,0.0));
}

float sdTorus(vec3 p, vec2 t, bool multiple)
{	
	if(multiple == true) 
	{
		p.x = mod(p.x, 3.0) - 1.5;
    		p.z = mod(p.z, 3.0) - 1.5;
	}
  	vec2 q = vec2(length(p.xz)-t.x,p.y);
  	return length(q)-t.y;
}

float sdHexPrism(vec3 p, vec2 h, bool multiple)
{
	if(multiple == true) 
	{
		p.x = mod(p.x, 3.0) - 1.5;
    		p.z = mod(p.z, 3.0) - 1.5;
	}
    	vec3 q = abs(p);
    	return max(q.z-h.y,max((q.x*0.866025+q.y*0.5),q.y)-h.x);
}

//From camera(rayOrigin) ray is cast for every pixel in quad. Ray follows vector from 
//camera(rayOrigin) to direction of pixel(rayDirection). This is done in steps, and in
//every step combination of distance functions is calcuted. This value is compared to 
//threshold value and if it is smaller we know that we have hit surface.
vec2 raymarch(vec3 rayOrigin, vec3 rayDirection) {
	float totalDistance = 0.0;
	float steps = 0.0;
	for(int i = 0; i < maxSteps; i++) {
		float d1 = sdSphere(rayOrigin + rayDirection * totalDistance, 0.65, true);
		float d2 = sdBox(rayOrigin + rayDirection * totalDistance, vec3(0.5, 0.5, 0.5), true);
		float d3 = sdTorus(rayOrigin + rayDirection * totalDistance, vec2(0.5, 0.5), true);
		float d4 = sdHexPrism(rayOrigin + rayDirection * totalDistance, vec2(0.5, 0.5), true);
		float d = min(d1, d3);
		steps += 1.0;
		if(d < distanceThreshold) {
			return vec2(totalDistance, steps);
		}
		totalDistance += d;
	}
	return vec2(totalDistance, steps);
}

//Process color pixel in question, now this only modifies pixel color values
//depending on how far ray had to travel and and many steps it had to take
//to find surface to hit.
vec4 processColor(vec2 t)
{
	vec3 c = vec3(0.4 - (t.x / oblivion), 1.0 - (t.y / float(maxSteps)), 0.0);
	
	return vec4(c, 1.0);
}
//Main program to start raymarching for each pixel in quad. 
void main(void)
{
	vec2 uv = (gl_FragCoord.xy / resolution) - 0.5;
	float fov  = 1.0;
	
	vec3 rd = vec3(uv.x * fov, uv.y * fov * aspectRatio, 1.0);

	vec3 ro = vec3(sin(time), 1.0, cos(time));
	
	vec2 t = raymarch(ro, rd);
	
	
	gl_FragColor = processColor(t);

}