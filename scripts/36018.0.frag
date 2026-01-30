#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );;

	vec3 color = vec3(0.0);
	
	color = vec3(smoothstep(0.5,max(mix(position.y, 1.0 - position.y, 3.0),0.0),distance(position, vec2(0.5))));

	gl_FragColor = vec4(color, 1.0 );

}