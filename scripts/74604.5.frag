//Original code 129 bytes https://www.dwitter.net/d/21373 - by Pascal

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

#define S sin
#define C cos
#define t time
#define X uv.x*10.
#define Y -uv.y*10.

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy-.8* resolution.xy )/resolution.y-.5 ;
	
	float c = S(X/20.+Y/15.)*C(X/30.+t+cos(.5*t+Y/5.));
	vec3 a_color = vec3(1, 1.3, .8)+c ;
	vec3 b_color = vec3(0.05, 0.3, .6)+c;
	vec3 color = mix(a_color, b_color, 0.07);
	gl_FragColor = vec4( color, 0.2 );

}