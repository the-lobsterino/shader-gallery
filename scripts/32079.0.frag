#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
#define NUM_SEG 24.0

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 p = position - vec2(0.5, 0.3);
	float theta = atan(p.y / p.x) - (time/ 1.0)*.2;
	float seg = theta / (3.1416/ NUM_SEG);
	
	
	
	// clamp — constrain a value to lie between two further values
	// floor — find the nearest integer less than or equal to the parameter
	// mod — compute value of one parameter modulo another
	float color = clamp(floor(mod(seg, 1.5)), (cos(time)), 0.7);
	
	
	gl_FragColor = vec4(0.3, color, color , 1.0 );

}