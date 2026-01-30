#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define amplitude 0.08
#define speed 5.0
#define transf 20.0

// http://adrianboeing.blogspot.mx/2011/02/ripple-effect-in-webgl.html
void main( void ) {
	vec2 position = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
	float cLength = length(position);
	vec2 uv = gl_FragCoord.xy / resolution.xy + ( position / cLength ) * cos( cLength * transf - time * speed ) * amplitude;
	gl_FragColor = vec4(uv.x, uv.x, uv.x, 1.);
}