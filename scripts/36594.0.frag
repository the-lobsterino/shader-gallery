#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define M_PI 3.1415926535897932384626433832795
#define PARTICLES 630.0
#define PHASE 0.1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( (gl_FragCoord.xy - resolution.xy / 2.0) / resolution.xy );

	vec4 color = vec4(0.0, 0.0, 0.0, 1.0);
	float speedFactor = 0.8;
	float freqLeft =  2.0;
	float freqRight = 3.0; //5.0 / freqLeft;
	float phase = 0.0; //(M_PI / 2.0);
	for(float i = 0.0; i < PARTICLES; i++) {
		vec2 p = vec2(0.2 * sin(i*PHASE + speedFactor*freqLeft*time),0.2 * sin(i*PHASE + phase + speedFactor*freqRight*time));
		color += vec4(0.001 / distance(position, p), 0.0005 / distance(position, p), 0.0, 1.0);
	}
	
	
	
	
	gl_FragColor = color;

}