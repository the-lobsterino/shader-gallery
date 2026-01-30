#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define LIGHT_SOURCE_RADIUS 700.0
#define BORDER_RADIUS	    100.0
#define LIGHT_SOURCE_POS    mouse
#define BORDER_POS          vec2(0.5)

void main( void ) {
	float border = 1.0 - length(BORDER_POS * resolution - gl_FragCoord.xy) + BORDER_RADIUS;
	
	float lightSource = 1.0 - length(LIGHT_SOURCE_POS * resolution - gl_FragCoord.xy) + LIGHT_SOURCE_RADIUS;
	lightSource /= 1000.0;
	
	if (gl_FragCoord.x > BORDER_POS.x && gl_FragCoord.y > BORDER_POS.y)
		gl_FragColor = vec4(0.0);
	else
		gl_FragColor = vec4(max(lightSource, border));
}