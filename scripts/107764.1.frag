#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy ;

	

	gl_FragColor = vec4( vec3( position.x, position.y, 1.0 ), 1.0 );

}