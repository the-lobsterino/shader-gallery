#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// recursiveToroidal   1/2018
// mods by sphinx
// more mods by i.g.p.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buffer;

float cosh(float v)
{
  float t = exp(v);
  return (t + 1.0 / t) * 0.5;
}
 

float sinh(float v)
{
  float t = exp(v);
  return (t - 1.0 / t) * 0.5;
}


vec2 cartesian_to_toroidal(vec2 c)
{	
  float cc = cosh(c.x)-cos(c.y);
  return vec2(sinh(c.x-c.y) / cc
	     ,sinh(c.x+c.y) / cc);
}

void main( void ) 
{
	vec2 p 		= (gl_FragCoord.xy - resolution / 2.) / resolution.x;
	p 		= cartesian_to_toroidal(p-(mouse-.5)) * vec2((sqrt(5.)+1.))*.0625;
	float c		= mod(floor(p.x) + floor(p.y), 2.);
	c 		= fract(mix(c*0.6, texture2D(buffer, (fract(vec2(p.x, p.y)))).x, .6))*1.05;

	gl_FragColor = vec4(1.1*c, c*c, 1.6*c, 1.);
}