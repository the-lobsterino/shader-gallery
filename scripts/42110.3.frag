#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	vec2 oP = position;
	position.x *= position.x * position.y;
	position.x += .5 + floor(time) - time;
	position.x = .5 - position.x;

	vec3 color = vec3(255., 140., 0.) / 255.;
	for (float i = 0.; i < 1.; i += .2) {
		float osc = 0.5 * (floor(position.x + i) - position.x - i);
		if (abs(position.y - (1.0 + osc)) < 0.01) {
			color.yz += 1. + sin(oP.x * 100.);	
		} else if (abs(position.y - (0.5 + osc)) < 0.01) {
			color.yz += 1. + sin(oP.x * 100.);	
		} else if (abs(position.y - (floor(1. - position.x) + position.x + osc)) < 0.01) {
			color.yz += 1. + cos(oP.y * 150.);	
		}
        }

	gl_FragColor = vec4( color, 1. );

}