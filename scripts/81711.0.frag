#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy/resolution.xy;
	gl_FragColor = vec4( position.x, 0.0, 0.0, 1.0 );

}