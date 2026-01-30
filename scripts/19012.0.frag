#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float d (vec2 p) {	
	return smoothstep(0.7, 0., smoothstep(0., (sin(p.x * sin(time) * 0.01) + 2.0) * 0.2, p.y / resolution.y));	
}

void main( void ) {	
	
	gl_FragColor = vec4(0.0, d(vec2(gl_FragCoord.x + 100.0, gl_FragCoord.y)) * 0.4, d(gl_FragCoord.xy), 1.0);
}