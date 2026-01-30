#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	float x = sin(mouse.x/resolution.x);
	float y = sin(mouse.y/resolution.y);
	
	gl_FragColor = vec4( x,y,1.0,1.0);

}