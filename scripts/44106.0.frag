#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	if(position.x < 50.0 && position.y < 100.0) {
		gl_FragColor = vec4(1, 0, 0, 1);
	}
}
