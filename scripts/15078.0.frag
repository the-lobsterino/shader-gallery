#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x);
	vec2 m = vec2(mouse.x,mouse.y/2.0);
	float ang = atan(-position.y+0.25,position.x-0.5)*0.16+0.5;
	float len = pow((1.0-length(position-m)*3.0),30.0)+pow((cos(1.0-length(position-m)*30.0+time)),30.0);
	gl_FragColor = vec4(pow(len,0.3)*2.0,len,len, 1.0 );

}