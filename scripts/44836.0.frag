#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;


// user define
#define REPEAT_NUM 12
#define PI 3.14159265359
#define PI2 (PI * 2.)

// [HSV to RGB] color convert
// Reference from http://www.demoscene.jp/?p=1460
vec3 Hue_(float hue)
{
	vec3 rgb = fract(hue + vec3(0.0, 2.0/3.0, 1.0/3.0));
	rgb = abs(rgb*2.0 - 1.0);
	return clamp(rgb*3.0-1.0, 0.0, 1.0);
}
vec3 HSVtoRGB(vec3 hsv)
{
	return ((Hue_(hsv.x)-1.0)*hsv.y + 1.0) * hsv.z;
}
// [END HSV to RGB]

// random
float rnd(vec2 n){
    return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

// 
float lineCircle(vec2 p, float width, float radius)
{
	vec2 dir = p;
	return 
		smoothstep(radius + width, radius + width - 0.01, length(dir)) *
		smoothstep(radius - 0.01, radius, length(dir));	
}

float fragCircle(vec2 p, float width, float radius, float startAngle, float endAngle)
{
	float light = 0.;
	light += lineCircle(p, width, radius);
	
	float angle = atan(p.y, p.x) + PI; // [-pi, pi] to [0, 2pi]

	float angleW = abs(endAngle - startAngle);
	if(angle < startAngle || angle >= startAngle + angleW)
		light = 0.0;
	
	return light;	
}

float fragArc(vec2 p, float width, float radius, float startAngle, float endAngle)
{
	float light = 0.;	
	float angle = atan(p.y, p.x) + PI; // [-pi, pi] to [0, 2pi]
	float arcW = abs(endAngle - startAngle);
	
	light += lineCircle(p, width, radius) * 
		smoothstep(startAngle, startAngle + 0.01, angle) *
		 (1. - smoothstep(startAngle + arcW - 0.01, startAngle + arcW, angle));
	
	return light;
}

void main( void ) 
{
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float light = 0.;
	
	// full circle	
	for(int i=1; i < 70; ++i)  
	{
		float width = rnd(vec2(i + 12847)) * 0.02;
		float radius = rnd(vec2(i)) * 0.9 + 0.1;
		float str = rnd(vec2(i + 1000));
		light += str * lineCircle(p, width, radius);
	}

	// fragment circle
	for(int i=1; i < 120; ++i)
	{
		float width = rnd(vec2(i + 10000)) * 0.02;
		float radius = rnd(vec2(i + 1000)) * 0.95 + 0.01;
		float start = rnd(vec2(i + 100000)) * PI2;
		float end = rnd(vec2(i + 10000000)) * PI2;
		float str = rnd(vec2(i + 10000));
		light += str * fragCircle(p, width, radius, start, end);
	}

	// fragment arc
	for(int i=1; i < 100; ++i)
	{
		float width = rnd(vec2(i + 1308706)) * 0.05 + 0.1;
		float radius = rnd(vec2(i + 128899)) * 0.7 + 0.03;
		float start = rnd(vec2(i + 100000)) * PI2;
		float end = start + rnd(vec2(i + 10000)) * PI / 32. + PI / 64.;
		light += 0.1 * fragArc(p - vec2(0.001), width, radius, start, end);
		light += fragArc(p, width, radius, start, end);
	}
	
	// back color
	light += 0.001 / length(p) + 0.4;

	gl_FragColor = vec4(vec3(light), 1.0);
}