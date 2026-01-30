#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float x = gl_FragCoord.x / (resolution.x * 0.1) ;
	float y = gl_FragCoord.y / (resolution.y * 0.5) ;
	float value = 0.0;
	
	float result = ((sin(x + time) + 1.0) / 2.0);
	result = result + 0.5;
	float thickness = 0.01;
	if (y < result + thickness && y > result - thickness) {
		value = 1.0;
	}
	
	
	gl_FragColor = vec4(value, value, value, 1.0);
}