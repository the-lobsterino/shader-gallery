#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = position.y + sin(position.x * 4. + time * 2.) * 0.1;

	gl_FragColor = vec4( vec3( color ), 1.0 );

}