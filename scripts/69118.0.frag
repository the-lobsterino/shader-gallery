// 138 byte version: https://www.dwitter.net/d/19953
// more dweets by me: https://www.dwitter.net/u/danny@hille.dk
#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy-0.5 )*10.0;
	
	p = floor(48.*p)/48.0;
	float X = p.x;
	float Y = p.y;
	float t = time/10.;
	gl_FragColor = vec4( vec3( sin(t*10.+X*2.*X-Y*Y), cos(t*18.+X*Y), sin(t*22.+X*X+Y*Y)), 0.5 );

}