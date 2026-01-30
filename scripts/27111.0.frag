#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec3 color;
	
	
	color.r = clamp(gl_FragCoord.x / 512.0, 0.0, 2.0);
	color.g = 1.5;
	color.b = 1.5;
	
	gl_FragColor = vec4(color, 0.0);

}