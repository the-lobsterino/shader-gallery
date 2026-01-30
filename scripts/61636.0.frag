precision mediump float;
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;


	gl_FragColor = vec4( pos,0.0,1.0 );

}