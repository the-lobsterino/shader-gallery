#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.5;// + mouse / 4.0;

	float factor = 0.0;
	factor = sin(time) * position.y;
	factor += cos(time) * position.x;
	
	vec3 color = factor * vec3(0.1, 0.5, 0.8 );
	
	gl_FragColor = vec4(color, 1.0); 

}