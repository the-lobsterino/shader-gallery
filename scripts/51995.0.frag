#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main( void ) {
	float scale = 0.0033 * resolution.x;
	gl_FragColor = vec4( cos(time) + sin(gl_FragCoord.x / scale), cos(time + 90.0) + sin((gl_FragCoord.x + gl_FragCoord.y) * sin(45.0) / scale), sin(time) + sin(gl_FragCoord.y / scale), 1.0 );
}