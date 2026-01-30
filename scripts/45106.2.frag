//Tupper's self-referential formula scroll

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;
	
	float new_x = (position.x-.125)*resolution.x/10.0;
	float new_y = ((position.y-.125)*resolution.y+(time*10000.0))/0.01;
	float color = 0.0;
	if (0.5 < floor(mod(floor(new_y/17.0)*pow(2.0 , (-17.0*floor(new_x)-mod(floor(new_y), 17.0))),2.0))) {
		color = 1.0;
	}
	

	gl_FragColor = vec4( vec3( color, color, color ), 1.0 );

}