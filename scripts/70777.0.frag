//Original code 129 bytes https://www.dwitter.net/d/21373 - by Pascal

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define S sin
#define C cos
#define t time
#define X uv.x*32.
#define Y -uv.y*32.

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy-.5* resolution.xy )/resolution.y-.5 ;
	
	float c = S(X/10.+Y/15.)*S(X/20.+t+S(2.*t+Y/5.));
	
	gl_FragColor = vec4( vec3( 1.0, c, .5+c), 1.0 );

}