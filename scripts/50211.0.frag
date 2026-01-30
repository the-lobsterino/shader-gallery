#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define RADIUS           50.0
#define LIGHT_POS        resolution / 2.0

vec2 normal(vec2 _vec2) {
	return vec2(-_vec2.y, _vec2.x);
}

void main( void ) {
	float circle = 1.0 - length(mouse * resolution - gl_FragCoord.xy) + RADIUS;
	
	float light = 1.0 - length(LIGHT_POS - gl_FragCoord.xy) + 10.0;
	
	gl_FragColor = vec4(mix(sign(1.0 - light / circle), sign(1.0 - circle / light), 0.56));
}