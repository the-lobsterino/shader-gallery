#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {


	gl_FragColor = vec4( vec3( 0.2, tan(gl_FragCoord.y + time * 5.0), 0.50 + sin(gl_FragCoord.y + time * 4.0)), 1.0 );

}