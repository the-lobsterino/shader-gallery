#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define pi 3.14159265358
#define linecount 5.0
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x );

	float a = atan(-position.y+0.25,position.x-0.5);
	float l = 1.0-length(position-vec2(0.5,0.25));
	gl_FragColor = vec4( vec3( cos(a*linecount+time)*cos(l*pi*4.0) )*vec3(1.0,1.0,0.5)+vec3(0.5), 1.0 );
}