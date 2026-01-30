#extension GL_OES_standard_derivatives : enable

precision highp float;
uniform vec2 resolution;
uniform float time;

void main( void ) {

	vec2 position = gl_FragCoord.xy;

	float color = tan((mod(position.x * position.y,111.-cos(time))-  cos(time*.302)+23.));

	gl_FragColor = vec4( vec3( color, -color, color ), 1.0 );
}
