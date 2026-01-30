#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
//varying vec2 surfacePosition;

#define PI 3.14159265359
#define TWOPI 6.28318530718
void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution );
	//vec2 uv = surfacePosition;
	vec2 point = vec2(.0);
	float a = atan(uv.x-mouse.x,uv.y-mouse.y);
	float d = distance(mouse,uv)*20.;
	
	float r = 0.0;
	float g = 0.0;
	float b = 0.0;
	b = mix(sin(a+time-d),(1.),-0.);
	g = mix(sin(a+time-d+PI),(1.),-0.);
	//r = mix(sin(a+time),(1.),-PI);
	
	gl_FragColor = vec4( 0., g, b, 1.0 );
}