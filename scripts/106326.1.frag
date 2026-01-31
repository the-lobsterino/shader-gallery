#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) + mouse / 4.0;

	float color = 0.;
	color += cos(time * 0.5 * ( distance(position, (vec2(sin(time),sin(time))) * 0.5 + 0.5) * 0.25 )) * 0.25;
	color += cos(time * 0.5 * ( distance(position, (vec2(cos(time),cos(time))) * 0.5 + 0.5) * 0.25 )) * 0.25;
	color += cos(time * 0.5 * ( distance(position, (vec2(sin(time),cos(time))) * 0.5 + 0.5) * 0.25 )) * 0.25;
	color += cos(time * 0.5 * ( distance(position, (vec2(cos(time),sin(time))) * 0.5 + 0.5) * 0.25 )) * 0.25;
			 
	
	gl_FragColor = vec4( vec3(color) * 0.5 + 0.5, 1.0 );

}