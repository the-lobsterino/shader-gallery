#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D bk;

#define PI 3.1415926535
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }

#define tm (time * .0125)

float triangles(vec2 pos) 
{	vec2 interval = pos * vec2(10., 5.);
	if (mod(interval.y, 2.) < 1.) interval.y = -interval.y + 1.;
	
	vec2 fi = floor(interval);
	if (mod(fi.x, 2.) < 1.) fi.y = -fi.y + interval.y;
	else fi.y = fi.y - interval.y + 1.;

	float color = pow(sin(mod(2.*tm, 2.*PI) + rand(vec2(floor(interval.x + fi.y), floor(interval.y))) * 100.), 2.);
	return color;
}
	
mat2 rm(float t)
{
	float c,s;
	c = cos(t);
	s = sin(t);
	return mat2(c,s,-s,c);
}

void main(void) 
{
	vec2 pos 	= (2.*gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y) + 32.;
	pos 		*= 0.025;

	float color 	= 0.;
	const int iter 	= 16;
	
	float t 	= float(iter);
	float a 	= float(iter)/t;
	float f 	= 1.5;
	for(int i = 0; i < iter; i++)
	{
		color = mix(color, abs(color-triangles(pos*f)*a), .15);
		pos *= rm(f*f*2.);
		pos += (color-1.)*.0000025;
		a += .25/t;
		f *= 1.5+a;	
	}
	
	gl_FragColor = vec4(color*color*color*5.);
	gl_FragColor += 0.94*(texture2D(bk, gl_FragCoord.xy/resolution) - gl_FragColor);
	
	gl_FragColor = 0.337*(texture2D(bk, fract((vec2(0.,1.)+gl_FragCoord.xy)/resolution))+texture2D(bk, fract((vec2(0.,3.)+gl_FragCoord.xy)/resolution))+gl_FragColor);
	
	gl_FragColor.xyz *= vec3(.99,.984,.982);
}