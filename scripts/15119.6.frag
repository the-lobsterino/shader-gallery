#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy );
	
	float r = cos (p.x * 3.14 *10.0); 
	
	float g = sin (p.x * 3.14 * 30.0);

	float b = sin ((r+g) * 3.14 +time * 10.0);
	
	gl_FragColor = vec4 ( r, g, b, 1.0 );
}