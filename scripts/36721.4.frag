#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy*vec2(sin(time), sin(time)) / resolution.xy );// + mouse / 4.0;

	gl_FragColor = vec4(vec3(position, sin(time)+2.0), 1.0);

}