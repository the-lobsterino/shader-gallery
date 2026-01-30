#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



void main( void ) {

	vec2  dstvec  = (mouse.xy - gl_FragCoord.xy / resolution.xy) * vec2(2., 1.);
	float dstfrag = sqrt(dot(dstvec, dstvec)) * 4.;
				  
	gl_FragColor = vec4( vec3(1.-dstfrag, 1.-dstfrag, 1.-dstfrag), 1.0);

}