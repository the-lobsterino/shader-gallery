// eye of SHAT

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
	p.x += sin(p.x+p.y+time)*0.1;
	p.y += cos(p.y+time)*0.05;
	p*=sin(time+length(p*p));
	p *= 3.1+sin(2.7*time+p.x*32.0+length(p))*1.35;
	p.y = 0.01/dot(p,p);
	p.x = 0.08/dot(p,p);

	
	float a = atan(0.4*p.y, p.x);
	
	vec4 c = vec4(length(p*p)+cos(p.y*132.+time+a*64.), sin(time-a*323.3), .15/abs(cos(time+p.x+p.y)), 1.);
	c *= 1. - length(p);
	
	c = c * 0.5 + 0.5;
	
	c *= smoothstep(3.25, 0.1, length(p));

	c.a = 1.0;


	gl_FragColor = c;

}