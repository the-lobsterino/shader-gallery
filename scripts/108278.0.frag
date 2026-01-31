#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float nn = 0.5 + 0.5*sin(position.x*300.0);	

	gl_FragColor = vec4( nn,nn,nn, 1.0 );

}