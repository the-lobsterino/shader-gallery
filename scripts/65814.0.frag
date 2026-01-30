#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#ifndef SHADER_TOY
#define iGlobalTime time
#define iResolution resolution
#endif

#define LineWidth 0.02
bool IsEqual(float x, float y){ return abs(x-y)<LineWidth; }
bool IsEqual(float x){ return IsEqual(x, gl_FragCoord.y / iResolution.y); }

vec3 Coloring(float x){ return IsEqual(x) ? vec3(1.) : vec3(0.); }

void main() 
{
	float x = (gl_FragCoord.x / iResolution.x);

//	x = pow(x, -2.);
//	x = 1.-pow(x, 2.0);
//	x = pow(1.-x, 2.0);
//	x = 1.-pow(1.-x, 3.0);
//	x = sin(x*3.14);
//	x = cos(x*6.28)*0.5+0.5;
//	x = sqrt(x);
//	x = sign(x*2.-1.0)*0.5+0.5;

/*	{
		x = (x*2.0-1.0)*5.;
		x = floor(x);
		x = trunc(x);
		x = ceil(x);
		x = fract(x);
		x = mod(x, 3.);
		x = x/5.0 * 0.5+0.5;
	}
*/

//	x = exp(-x);
/*
	{
		float y = 1.;
		for(int i = 0; i < 10; i++) 
		{
			y *= exp(-0.1*x);
		}
		x = y;
		
	}
*/
//	x=log(1.0+x);

//	x = clamp(x, 0.3, 0.7);

//	x = mix(0.3, 0.7, x);
//	x = smoothstep(0.3, 0.7, x);
//	x = smoothstep(0.3, 0.3, x);

	gl_FragColor = vec4(Coloring(x), 1.0);
}