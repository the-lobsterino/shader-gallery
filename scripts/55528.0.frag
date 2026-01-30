#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 pos = vec2(10.5, 10.5);
	
	if (gl_FragCoord.xy == pos) {
		gl_FragColor = vec4(1.0, -1.0, 1.0, -1.0);
		return;
	}
	
	if (distance(gl_FragCoord.xy, vec2(30.5, 30.5)) < 5.0) {
		gl_FragColor = vec4(texture2D(backbuffer, pos / resolution).r);
	}

	if (distance(gl_FragCoord.xy, vec2(50.5, 30.5)) < 5.0) {
		gl_FragColor = -vec4(texture2D(backbuffer, pos / resolution).g);
	}

	if (distance(gl_FragCoord.xy, vec2(70.5, 30.5)) < 5.0) {
		gl_FragColor = vec4(texture2D(backbuffer, pos / resolution).b);
	}

	if (distance(gl_FragCoord.xy, vec2(90.5, 30.5)) < 5.0) {
		gl_FragColor = -vec4(texture2D(backbuffer, pos / resolution).a);
	}
}