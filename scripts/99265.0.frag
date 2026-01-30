#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define SPEED 3.5
#define AMPLITUDE .30
#define FREQUENCY 16.
#define VERTICAL_OFFSET .5

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
    	float s = sin(position.x * FREQUENCY+time*SPEED) * AMPLITUDE + VERTICAL_OFFSET;
	gl_FragColor = vec4(smoothstep(0.01, .02, abs(s-position.y)));;
}