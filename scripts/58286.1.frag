#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pseudo_rand() {
	// https://gist.github.com/johansten/3633917
	float a = fract(dot(gl_FragCoord.xy, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
	float s = a * (6.182785114200511 + a*a * (-38.026512460676566 + a*a * 53.392573080032137));
	float t = fract(s * 43758.5453);
	return t;
}

void main( void ) {
	gl_FragColor = vec4(vec3(pseudo_rand()), 1.0);
}