#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PULSE(a,b,x) (step((a),(x)) - step((b),(x)))

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse + 0.5;

	float color = 0.0;
	color += PULSE(0.4, 0.6, fract(position.x / .10));

	gl_FragColor = vec4(color, color, color, 1.0);

}