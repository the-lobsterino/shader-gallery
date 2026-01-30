// mouse x: rotate
// mouse y: move up/down
#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.14159265359

#define WIDTH 6.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {

	vec2 pos = surfacePosition;
	
	float rot = (mouse.x-0.5)*PI;
	
	float yLo = 1.+WIDTH*mouse.y;
	float yHi = 1.+WIDTH*(1.-mouse.y);
	
	pos = vec2( pos.x*cos(rot) - pos.y*sin(rot), pos.y*cos(rot) + pos.x*sin(rot));
	
	float dist = tan(mix(PI/2., atan((pos.y > 0. ? yHi : yLo), 1.), abs(pos.y)));
	
	pos.x *= dist;

	float color = 0.5 + 0.5 * sin(cos(pos.x) + sin(dist+time*16.));
	
	color /= sqrt((dist)/2.);

	gl_FragColor = vec4( color*0.5, 0.25 + 0.75*color*(0.5+sin(time)*0.5), 0.25 + 0.75*color*(0.5+cos(time)*0.5), 1. );

}