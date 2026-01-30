#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	
	if(gl_FragCoord.xy.x > time * 5.0) {
		gl_FragColor = vec4(1.0, 0, 0, 1.0);	
	} else {
		gl_FragColor = vec4(0, 0, 1.0, 1.0);
	}

}