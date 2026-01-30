#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

bool box(vec2 space, vec2 position, vec2 lengths){
	vec2 measure = abs(position-space)-lengths/2.;
	return measure.x < 0. && measure.y < 0.;
}


void main( void ) {
	
	bool result = false;
	vec2 s = surfacePosition*4.;
	vec2 p = vec2(0.);
	vec2 l = vec2(1., .1);
	
	#define ROTATE2D(THETA) mat2(cos(THETA), sin(THETA), -sin(THETA), cos(THETA))
	
	for(int i = 0; i <= 8; i += 1){
		result = result || box(s, p, l);
		float left_right = sign(s.x);
		s.x += -left_right/1.5;
		s *= ROTATE2D(3.14159/3.);
	}
	
	gl_FragColor = vec4( vec3( float(result) ), 1.0 );

}