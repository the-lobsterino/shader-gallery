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
	//p *= 1.3;
	p.y = 0.01/dot(p,p);
	p.x = 0.08/dot(p,p);

	
	float a = atan(p.y, p.x);
	
	vec4 c = vec4(cos(p.y*132.+time+a*64.), sin(time-a*323.3), 0, 1.);
	c *= 1. - length(p);
	
	c = c * 0.5 + 0.5;
	
	c *= smoothstep(3.25, 0.1, length(p));

	c.a = 1.0;


	gl_FragColor = c;

}