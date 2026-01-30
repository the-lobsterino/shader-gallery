#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec4 color = texture2D(backbuffer, position);
	float d = distance(gl_FragCoord.xy, mouse*resolution.xy);
	
	if (color.b < 1.0/d/d && d < 50.0) {
		color = vec4(0.0, 1.0/d/d, 1.0/d/d, 1.0);
	} else if (d < 5.0) {
		color = color;
	}

	gl_FragColor = color;

}