#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float thick = 15.0;
	
	float mx = resolution.x * mouse.x;
	
	float ratio = smoothstep(mx-thick, mx, gl_FragCoord.x) - smoothstep(mx, mx+thick, gl_FragCoord.x);
	
	gl_FragColor = vec4(1, 0, 0, 1) * ratio;
}