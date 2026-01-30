//The Random Shader

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
	return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
}

void main( void ) {
	
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(rand(position * time));
	
	gl_FragColor = vec4(color, 1.0);
}