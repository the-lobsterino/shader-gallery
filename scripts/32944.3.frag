#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	gl_FragColor = vec4(sin((gl_FragCoord.x - gl_FragCoord.y) / 2.0) * vec4(sin(time + mouse.x), cos(time + mouse.y), sin(time + mouse.y), 1));

}