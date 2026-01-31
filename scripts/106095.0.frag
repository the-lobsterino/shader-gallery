#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Created by inigo quilez - iq/2013
//   https://www.youtube.com/c/InigoQuilez
//   https://iquilezles.org
// I share this piece (art and code) here in Shadertoy and through its Public API, only for educational purposes. 
// You cannot use, sell, share or host this piece or modifications of it as part of your own commercial or non-commercial product, website or project.
// You can share a link to it or an unmodified screenshot of it provided you attribute "by Inigo Quilez, @iquilezles and iquilezles.org". 
// If you are a teacher, lecturer, educator or similar and these conditions are too restrictive for your needs, please contact me and we'll work it out.


// See here for more information on smooth iteration count:
//
// https://iquilezles.org/articles/msetsmooth


// increase this if you have a very fast GPU

// Converted to work on this site by @chaosrayne86 on Steam


float mandelbrot( in vec2 c )
{
	const float B = 256.0;
	vec2 z  = vec2(0.0);
	for( float i=0.; i<512.; i+=1. )
	{
	z = vec2( z.x*z.x - z.y*z.y, 2.*z.x*z.y ) + c;
	if( dot(z,z)>(B) )// break;
		return i;
	}
	return 0.0;
}

void main()
{
	vec3 col = vec3(0.0);
	vec2 p = (-resolution.xy + 2.0*gl_FragCoord.xy)/resolution.y;
	float zoo = 0.24;
	float coa = cos(zoo*time );
	float sia = sin(zoo*time );
	zoo = pow( zoo,9.0);
	vec2 xy = vec2( p.x*coa-p.y*sia, p.x*sia+p.y*coa);
	vec2 c = vec2(-.745,.186) + xy*zoo;
	
	float l = mandelbrot(c);
	
	col += 0.5 + 0.5*cos( 3.0 + l*0.15 + vec3(0.0,0.6,1.0));
	
	gl_FragColor = vec4( col, 1.0 );
}