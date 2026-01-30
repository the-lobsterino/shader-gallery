#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {
	vec2 p = ( gl_FragCoord.xy / resolution.xy )-vec2(0.3,0.3) ;
	gl_FragColor = 2000.*vec4(fract(p-vec2(0.3,0.3)),1,1);
}