#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = gl_FragCoord.xy - vec2(300, 300);
	vec2 b = vec2(200, 100);
	float d = length(max(abs(p)-b, 0.0)) - 30.0;
	if (d < 0.0) {
		gl_FragColor = vec4(1.0, 0, 0, 1.0);
	}
	else {
		gl_FragColor = vec4(1.0);
	}
}