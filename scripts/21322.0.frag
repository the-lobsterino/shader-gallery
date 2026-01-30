#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = gl_FragCoord.x/115.110+time*5.0+cos(position.y*10.+time+position.x*cos(time))*415.110;
	
}