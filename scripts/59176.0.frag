#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

uniform vec2 resolution;

#define speed 0.10
#define freq 100.
#define amp 100.
#define phase 0.0


void main( void ) {
	
	// Coordplane
	vec2 p = ( gl_FragCoord.y / resolution.xy );
	
	// Line Shape
	float sx = (amp)*0.9 * sqrt(tan( gl_FragCoord.x / (freq) * (p.x-phase) - 0.5 * (speed)*time)*3.5);
	
	// Draw Line
	float dy = 0.2/ ( 9. - sqrt((0.*p.y + sx - 1.2)));
	
	// Color
	gl_FragColor = vec4( 0.008 / dy, 0.05 * dy, 2.*dy, 1. );
	

}