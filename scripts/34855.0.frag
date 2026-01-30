#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define rot(x) mat2(cos(x), sin(x), -sin(x), cos(x))

void main( void ) {
	vec2 aspect = resolution.xy / min(resolution.x, resolution.y);
	vec2 position = (gl_FragCoord.xy / resolution.xy) * aspect * rot(sin(time) * 10.0);
	vec2 center = aspect * 0.5 * rot(sin(time) * 10.0);
	
	float t = dot(center, sin(center * 50.0 - position * 50.0));

	gl_FragColor = vec4( sin(time) * t, sin(time + 2.04) * t, sin(time + 4.08) * t, 1.0 );

}