#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float d = distance(gl_FragCoord.xy, mouse * resolution);
	if (d > 100.0) {
		gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	} else if (d > 96.0) {
		float progress = (d - 96.0) / 4.0;
		gl_FragColor = vec4( 0.5, 0.6, 0.7, 1.0 );
	} else {
		gl_FragColor = vec4( 1.0, 1.0, 1.0, 1.0 );	
	}

}