#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float Cube;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	if (position.x < abs(sin(time)) && position.y < abs(sin(time)))
		gl_FragColor = vec4(0, 0, abs(cos(time)), 1);
	else if (position.x > abs(sin(time)) && position.y > abs(sin(time)))
		gl_FragColor = vec4(abs(sin(time)), 0, 0, 1);
	else
		gl_FragColor = vec4(sin(position.x * sin(time)), cos(position.x * cos(time)), sin(time), 1);
}

//MADE IN TURKEY
//BY Selim