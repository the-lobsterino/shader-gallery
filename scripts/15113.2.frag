#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );  
	  
	float a = sin(p.x * 3.14 * 10.0);
	float b = sin(p.y * 3.14 * 15.0);
	float c = a - b;
	
	gl_FragColor = vec4( c, c, c, 1.0 );

}