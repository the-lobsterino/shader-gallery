#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
float rand3d(vec3 a){
	return fract(a.z + sin(a.x*a.y*1424.0) * 12345.2);
} 
void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float color = rand3d(vec3(position * 1.0, cos(time * 0.14))); 
	gl_FragColor = vec4( vec3( color ), 1.0 );

}