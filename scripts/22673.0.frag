#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define PI 3.14159265


//============================================================================================
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//
//	Original Author: 	Joshua Bramer
//	Data Created:		31 January 2015
//	
//	License:		Free for anything.
//
//-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_-_
//============================================================================================


/*******************************************/
/*  Change these values for more effects!  */
#define FAR_DIST               20.0
#define FOG_COLOR              vec3(0.0, 0.0, 0.04)
#define BASE_COLOR             vec3(0.1, 0.4, 0.6)
#define BRIGHTNESS_MODIFIER    7.0
#define MOVE_SPEED             1.0
#define SIDE_DRIFT	       0.0 * sin(time) * MOVE_SPEED
#define SPIN_SPEED	       0.25
#define COLOR_ANIMATION_SPEED  0.25
//#define RAISE_THE_ROOF
//#define SPIN_THE_WORLD
//#define NO_FOG
//#define ANIMATE_COLOR
/*******************************************/



#ifdef ANIMATE_COLOR
#undef FOG_COLOR
#define COLOR_HUE (sin(time * COLOR_ANIMATION_SPEED) * 0.5 + 0.5) * 360.0
#define COLOR_SAT 1.0
#define COLOR_BRIGHT 1.0
#define FOG_COLOR HSB_To_RGB(COLOR_HUE, COLOR_SAT, COLOR_BRIGHT * 0.1)
#endif


struct Plane
{
	vec3 normal;
	float offset;
};

// Finds the time (distance) along the ray to the point of intersection (if any).
// Checks the intersection time with the passed in value. Will only return a smaller time value.
// Formula was found here: http://www.cs.princeton.edu/courses/archive/fall00/cs426/lectures/raycast/sld017.htm
float RayToPlane(vec3 rayStart, vec3 rayNormal, Plane plane, float timeToBeat)
{	
	float t = -(dot(rayStart, rayNormal) + plane.offset) / dot(rayNormal, plane.normal);
	if(t <= 0.0 || t >= timeToBeat) { return timeToBeat; }
	return t;
}

// Constructs a plane given a point on the plane and the plane's normal.
Plane BuildPlane(vec3 pointOnPlane, vec3 normal)
{
	Plane p;
	p.normal = normalize(normal);
	p.offset = dot(pointOnPlane, p.normal);
	return p;
}

// Conversion formula found here:
// http://www.cs.rit.edu/~ncs/color/t_convert.html
vec3 HSB_To_RGB(float h, float s, float b)
{
	// Greyscale early return.
	if(s <= 0.0) { return vec3(b); }
	
	h *= 1.0 / 60.0;
	int sector = int(floor(h));
	float f = fract(h);
	
	float p = b * (1.0 - s);
	float q = b * (1.0 - s * f);
	float t = b * (1.0 - s * (1.0 - f));
	
	float rValues[6];
	float gValues[6];
	float bValues[6];
	
	rValues[0] = b;
	rValues[1] = q;
	rValues[2] = p;
	rValues[3] = p;
	rValues[4] = t;
	rValues[5] = b;
	
	gValues[0] = t;
	gValues[1] = b;
	gValues[2] = b;
	gValues[3] = q;
	gValues[4] = p;
	gValues[5] = p;
	
	bValues[0] = p;
	bValues[1] = p;
	bValues[2] = t;
	bValues[3] = b;
	bValues[4] = b;
	bValues[5] = q;
	
	// This for loop is necessary to allow array indexing. Constant value must be used.
	for(int i = 0; i < 6; ++i)
	{
		if(i == sector)
		{ 
			return vec3(rValues[i], gValues[i], bValues[i]);
		}
	}
	
	return vec3(rValues[0], gValues[0], bValues[0]);
}

// Calculates a color given a uv coordinate.
vec3 Texture(vec2 uv)
{
	// Default the value to black.
	vec3 color = vec3(0);
	
	// Store the uv coordinate temporarily.
	float x = uv.x;
	float y = uv.y;
	
	// Store a modified time value for optimization.
	float t = time * 0.5;
	
	// Shift the uv coordinate in a swirly pattern.
	uv.x += cos(x - t) * sin(y - t);
	uv.y += sin(y + t) * cos(x + t);
	
	// Get a value based on the distance to the center of a 'tile' created by the 'fract' method.
	float fx = fract(uv.x);
	float fy = fract(uv.y);
	float f  = distance(vec2(fx, fy), vec2(0.5, 0.5));
	
	// Set the base color
	#ifdef ANIMATE_COLOR
	vec3 baseColor = HSB_To_RGB(COLOR_HUE, COLOR_SAT, COLOR_BRIGHT);
	#else
	vec3 baseColor = BASE_COLOR;
	#endif
	
	// Add more contrast to the texture.
	color = vec3(pow(f, 2.0)) * baseColor;
	color += vec3(pow(f, 3.0)) * baseColor * BRIGHTNESS_MODIFIER;
	
	return vec3(color);
}

void main( void ) {
	// The final fragment color.
	vec3 finalColor = vec3(0, 0, 0);
	
	// Screen position:
	vec2 screenPos = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
	screenPos.x *= resolution.x / resolution.y;
	
	// Build the ray.
	vec3 rayStart  = vec3(0, 0, 0);
	vec3 rayNormal = normalize(vec3(screenPos, 1.0));
	
	#ifdef RAISE_THE_ROOF
	float y0 = sin(time) - 2.0;
	float y1 = sin(time + PI) + 2.0;
	#else
	float y0 = -2.0;
	float y1 =  2.0;
	#endif
	
	// Default the depth to the farthest visible distance.
	float depth = FAR_DIST;
	
	// Raycast against the planes.
	#ifdef SPIN_THE_WORLD
	float t = time * SPIN_SPEED;
	vec3 p0 = vec3(sin(t) * y0, cos(t) * y0, 0);
	vec3 p1 = vec3(sin(t) * y1, cos(t) * y1, 0);
	depth = RayToPlane(rayStart, rayNormal, BuildPlane(p0, p0), depth);
	depth = RayToPlane(rayStart, rayNormal, BuildPlane(p1, p1), depth);
	#else
	depth = RayToPlane(rayStart, rayNormal, BuildPlane(vec3(0, y0, 0), vec3(0, -1, 0)), depth);
	depth = RayToPlane(rayStart, rayNormal, BuildPlane(vec3(0, y1, 0), vec3(0, 1, 0)), depth);
	#endif
	
	// Get the hit point.
	vec3 hitPoint = rayStart + rayNormal * depth;
	
	// Translate forward.
	hitPoint.z += time * MOVE_SPEED;
	hitPoint.x += SIDE_DRIFT;
	
	
	// Calculate the fog and fade values.
	#ifndef NO_FOG
	float fog = depth / FAR_DIST;
	float fade = 1.0 - fog;
	#else
	float fade = 1.0;
	float fog = 1.0;
	#endif
	
	// Calculate the final color.
	finalColor = (fog * FOG_COLOR) + Texture(hitPoint.xz) * Texture(hitPoint.xy) * fade;
	
	gl_FragColor = vec4(finalColor, 1.0);
}