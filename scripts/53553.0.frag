#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main(void) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy) * 50.0;
	
	
	gl_FragColor = vec4((position * time * cos(time + position.x)) / 30000.0, 1.0, 1.0);
}