#ifdef GL_ES
precision mediump float;
#endif
//Cpt Ryu MS
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy-0.5);
	vec2 point = vec2(sin(time),sin(time*2.0)) / 3.14;
	
	float c0 = distance(point,position.xy)*8.0;
	
	gl_FragColor = vec4( vec3(c0)  , 1.0 );

}