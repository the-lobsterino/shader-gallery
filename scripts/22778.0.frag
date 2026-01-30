#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.1416;

void main( void ) {
	vec2 uv = gl_FragCoord.xy / resolution;
	float x = fract(sin(uv.x * PI * 2.0));
	gl_FragColor = vec4(x, 0, 0, 1);

}