#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define t (time * 1.5)

void main( void ) {

	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec2 p = uv - 0.5;
	//float r = 0.4 + 0.05 * sin(100.0 * atan(p.y / uv.x));
	float r = 0.4 + 0.05 * sin(6.0 * atan(p.y / p.x) - t);
	float color = step(length(p), r);
	gl_FragColor = vec4(color);
}