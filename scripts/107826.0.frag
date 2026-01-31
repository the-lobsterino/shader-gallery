//Trippy AF

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
	return fract(sin(dot(co, vec2(2.4375,time))) / 43758.5453);
}

void main( void ) {
	
	vec2 position = ( +1.0 + 2.0 * gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(rand(position * time/1.0));
	
	gl_FragColor = vec4(color, 1.0);
}