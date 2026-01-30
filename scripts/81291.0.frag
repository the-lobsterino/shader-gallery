#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float radius = .5;
	
	// vec3 color = 1.0 - vec3(distance(vec2(.5), position));
	vec3 color = 1.0 - vec3(pow(distance(vec2(.5), position), 1.2));
	color = color * vec3(1.00,0.10,0.55);
	
	gl_FragColor = vec4(color, 1.0);

}