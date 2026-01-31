#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform vec2 surfaceSize;

void main( void ) {
	vec2 coord = vec2(floor(gl_FragCoord.x / (resolution.x / 8.)),
			  floor(gl_FragCoord.y / (resolution.y / 8.)));
	// float index = coord.y * 8. + coord.x;
	
	if (mod(mod(coord.y, 2.) + coord.x, 2.) == 0.) {
		gl_FragColor = vec4(0., 0., 0., 1.);
	} else {
		gl_FragColor = vec4(1., 1., 1., 1.);
	}
}