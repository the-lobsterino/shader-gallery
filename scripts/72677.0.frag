#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;



void main( void ) {
	
	vec4 bg = vec4(10, 0.239, 0.239, 1.0);
		vec4 fg = vec4(1.0, 1.0, 1.0, 1.0);
	vec2 position = ( gl_FragCoord.xy / resolution.xy ) / 4.0;

	if (mod(position.x, 2.0) == 0.0) {
		gl_FragColor = fg;
	} else {
	
	gl_FragColor = bg;
	}
}