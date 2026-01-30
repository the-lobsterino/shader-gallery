#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 p) {
	return length(p);
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy * 2.0 - resolution ) / min(resolution.x, resolution.y) ;

	float d = circle(p);
	vec3 color = mix(vec3(1), vec3(0.8), step(d, 0.6));
	
	//if(d < 0.8) {
	//	color = vec3(0);
	//}
	

	gl_FragColor = vec4( color, 1.0 );

}