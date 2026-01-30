#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.414

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float c1 = 0.0;
	float c2 = 0.0;
	float c3 = 0.0;
	
	c1 = 0.5+0.5*sin(position.x+time);
	c2 = 0.5+0.5*sin(position.x+time+1./3.*PI);
	c3 = 0.5+0.5*sin(position.x+time+2./3.*PI);
	
	gl_FragColor = vec4( c1,c2,c3,1. );

}