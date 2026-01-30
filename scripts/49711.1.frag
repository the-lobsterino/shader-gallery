// AUTHOR: Adolf Hitler

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SIZE abs(sin(cos(time)*sin(time)))

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.yy );
	position = vec2(position.x * cos(time) - position.y * sin(time),position.y * cos(time) + position.x * sin(time));

	vec3 color = vec3(0.4, 0.9, 0.2);
	vec2 p = vec2(mod(position, SIZE));
	
	
	float a = sin(position.x * 5.0) - cos(position.y * 3.0);
	
	if(length(vec2(SIZE * 0.5 + cos(a) * 0.005, SIZE * 0.5  + sin(a) * 0.005) - p) < SIZE * 0.3)
		color = vec3(1.0);
	
	if(length(vec2(SIZE * 0.5 - cos(a) * 0.005, SIZE * 0.5  - sin(a) * 0.005) - p) < SIZE * 0.3)
		color = vec3(0.0);
	
	if(length(vec2(SIZE * 0.5, SIZE * 0.5) - p) < SIZE * 0.3)
		color = vec3(0.1, 0.2, 0.9);

	gl_FragColor = vec4(color, 1.0);

}