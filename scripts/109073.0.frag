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
	float t = time * 0.5;
	
	float c = S(X/10.+Y/15.)*C(X/20.+t+cos(.05*t+Y/5.));
	vec3 a_color = vec3(2.8, 2.8, 2.8) + c;
	vec3 b_color = vec3(2.8, 5.8, 6.8);
	vec3 color = mix(a_color, b_color, 0.6);
	gl_FragColor = vec4((floor(color * 4.0) / 30.0), 1.0 );
}