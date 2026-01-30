// 2D vector map
// Author: @amagitakayosi

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.141593

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2. - resolution )/ min(resolution.x, resolution.y );
	
	p.x = dot(p,p)*(0.6+sin(p.y*0.4+time)*0.3);
	p.y += p.x;
	float l = length(p);
	
	float a = atan(p.y, p.x);
	vec4 c = vec4(cos(time+a), sin(time+p.y*32.0*a), 0, 1.);
	c *= (1. - l+sin(p.y*15.)) ;
	c.b = (c.r+c.g)*0.25;	
	c = c * 0.5 + 0.5;
	
	
	

	gl_FragColor = c;

}