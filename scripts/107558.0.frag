//Trippy AF

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rand(vec2 co){
	return fract(sin(dot(co, vec2(gl_FragCoord.x/28.20, gl_FragCoord.y/28.20)))*20.2000000001);
}

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy / resolution.xy );
	vec3 color = vec3(rand(position * (time*2.0)));
	
	gl_FragColor = vec4(color, 221.0);
}