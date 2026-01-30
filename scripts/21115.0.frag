#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float x = length(gl_FragCoord.xy - resolution.xy * 0.5);
	float k = mouse.x;
	float color = 0.5 + 0.5 * sin(time + x * k);
	
	gl_FragColor = vec4(color, 0, 0, 1.0);

}