#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	gl_FragColor = (uv.y > 0.) ? vec4( 0.1, 0.2, 1.0, 1.0 ) : vec4( 1.0, 0.9, 0.1, 1.0 );
}