// Dithered background JRM

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

float rand(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {

	float c = rand(surfacePosition);
	

	gl_FragColor = vec4(c*.1,c*.1+.03,c*.1,1.);
}