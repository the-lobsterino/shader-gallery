#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;
	float col = noise(1.0);
	gl_FragColor = vec4( vec3( col, col * 0.5, sin( col + time / 3.0 ) * 0.75 ), 1.0 );

}