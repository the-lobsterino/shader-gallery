#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI atan(1.) * 4.

//taken from https://github.com/wsmind/js-pride/blob/master/shaders/rainbow.glsl
vec3 rainbow(float x)
{
	/*
		Target colors
		=============
		
		L  x   color
		0  0.0 vec4(1.0, 0.0, 0.0, 1.0);
		1  0.2 vec4(1.0, 0.5, 0.0, 1.0);
		2  0.4 vec4(1.0, 1.0, 0.0, 1.0);
		3  0.6 vec4(0.0, 0.5, 0.0, 1.0);
		4  0.8 vec4(0.0, 0.0, 1.0, 1.0);
		5  1.0 vec4(0.5, 0.0, 0.5, 1.0);
	*/
	
	float level = floor(x * 6.0);
	float r = float(level <= 2.0) + float(level > 4.0) * 0.5;
	float g = max(1.0 - abs(level - 2.0) * 0.5, 0.0);
	float b = (1.0 - (level - 4.0) * 0.5) * float(level >= 4.0);
	return vec3(r, g, b);
}


void main()
{
    vec2 p = ( gl_FragCoord.xy / resolution.xy ) * 2. - 1.;
	p.x *= resolution.x / resolution.y;
   
	
	float angle = atan(p.y, p.x) + time;
	if(angle < 0.) angle += PI * 2.;

   
	angle -= PI * sin(length(p) * 20.);
	vec3 color = 1. - rainbow(mod(angle, PI * 2.) / (PI * 2.));
	color *= (length(p) - .3);
	float gray = dot(color, vec3(0.299, 0.587, 0.114));
	color = mix(color, vec3(gray), 1.);
	
	gl_FragColor = vec4(color, 1.);
}