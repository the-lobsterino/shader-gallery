//Trippy AF

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
	return fract(sin(dot(co, vec2(gl_FragCoord.y/8.0, gl_FragCoord.x/8.0)))*0.1);
}

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(rand(position * (time*97.)));
	
	gl_FragColor = vec4(color, 5.9);
}