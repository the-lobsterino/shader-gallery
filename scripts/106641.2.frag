precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

const int points = 3;
const float pi = 3.14159265359;

float sigmoid(float x) {
    return 1.0 / (1.0 + exp(x));
}

float sinc(float x) {
    return sin(pi * x);
}

float cosc(float x) {
	return cos(pi * x);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy ) / resolution.xy + surfacePosition;
	position *= 3.0;
	vec2 mposition = ( mouse.xy / resolution.xy );

	float dist[3];
	for (int i=0; i < points; i++) {
		float f = float(i) / 5.17 + .1;
		vec2 root = vec2( cosc(time * f), sinc(time * f) );
		dist[i] = sigmoid(length(position - root)); 

	}

	gl_FragColor = vec4( dist[0], dist[1], dist[2], 1.0);

}