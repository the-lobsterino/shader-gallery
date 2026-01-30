#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = (2.0 * gl_FragCoord.xy + 1.0 - resolution.xy ) / resolution.x;
	
	vec3 color = vec3(0.0);
	float radius = (abs(sin(time)) + 0.2) / 7.0;
	float radius2 = (abs(cos(time)) + 0.2) / 7.0;
	
	if (distance(position, vec2(0.0,0.0)) < radius2) {
		color.g = mouse.x;
		color.b = mouse.y;
	}
	
	position.x = abs(position.x);
	position.y = abs(position.y);
	
	if (distance(position, vec2(0.5,0.25)) < radius) {
		color.r = mouse.x;
		color.g = mouse.y;
	}
	
	color /= 5.0;
	
	gl_FragColor = vec4( color, 1.0 );

}