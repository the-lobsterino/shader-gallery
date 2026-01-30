#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
//uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )  ;

	float b = resolution.y*0.9;
	float bb = sin(b*p.y + time*5.0)*0.3;

	gl_FragColor = vec4( 0,0,bb, 3.0 );

}