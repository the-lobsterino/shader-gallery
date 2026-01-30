#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - mouse;
	vec2 cut = sign(sin(position * vec2(100.0, 50.0)));
	float c = (cut.x * cut.y + 1.0) / 2.0;

	gl_FragColor = vec4(c, c, c, 1.0);

}