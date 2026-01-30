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
	
	float c = S(X/10.+Y/15.)*C(X/20.+t+cos(.05*t+Y/5.));
	vec3 a_color = vec3(.9, .0, .0) + c;
	vec3 b_color = vec3(.9, .0, .0);
	vec3 color = mix(a_color, b_color, 0.7);
	gl_FragColor = vec4( color, 0.1 );

}