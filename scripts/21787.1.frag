#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float g = (gl_FragCoord.x * gl_FragCoord.y) / (resolution.x * resolution.y);
	
	
	gl_FragColor = vec4(0.0,0.8,1.3,1.0)*sin((gl_FragCoord.y/ resolution.y ) * sin(g * 100000.0 + time) * 9.0 + (gl_FragCoord.x / resolution.y + 20.0) );

}