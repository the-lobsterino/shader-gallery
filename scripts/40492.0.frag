#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

uniform sampler2D backbuffer;


#define read() (texture2D(backbuffer, vec2(gl_FragCoord.x, gl_FragCoord.y)  / resolution.xy).xyz)

float box(vec2 space, vec2 position, vec2 lengths){
	vec2 measure = abs(position-space)-lengths/2.;
	return measure.x + measure.y;
}


void main( void ) {
	
	float result = 1.;
	vec2 s = surfacePosition*7.;
	vec2 p = vec2(0.);
	vec2 l = vec2(1., .1);
	vec2 mouse = vec2(0.5) + vec2(sin(time + cos(time)), cos(time + sin(time))) * 0.15;
	
	#define ROTATE2D(THETA) mat2(cos(THETA), sin(THETA), -sin(THETA), cos(THETA))
	
	for(int i = 0; i <= 2; i += 1){
		result = fract(result+box(s, p, l));
		vec2 left_right = vec2(sign(s.x), sign(s.y));
		s += -left_right*(mouse-.5)*10.;
		s *= ROTATE2D((.1+length(s)*.4)*(left_right.x*left_right.y));
	}
	
	gl_FragColor = vec4( mix(vec3( float(result) ) * vec3(sin(time + result), sin(time + 2.04+ result), sin(time + 4.08+ result)), read(), 0.5), 1.0 );

}