#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

void main( void ) {
	
	vec2 mousep = resolution * mouse;
	vec4 col = texture2D(backbuffer, gl_FragCoord.xy / resolution) - 0.01;
	
}