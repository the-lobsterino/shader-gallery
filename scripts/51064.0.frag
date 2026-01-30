#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse * 4.0;

	position *= 16.0;

	gl_FragColor = vec4( vec3( sin(position.x) / sin(position.y) ), 1.0 );

}