#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec4 translation = vec4(5.0, 5.0, 5.0, 1.0);
	vec2 scale 	 = vec2(3.0, 3.0);	
	vec2 pos = surfacePosition;//( gl_FragCoord.xy / resolution.xy )*scale - translation;
	// x_(n+1) = r * x_n * (1 - x_n)	
	
	const float n = 20.0;
	float x = 2.0/pos.y;
	float r = 1.0/pos.x;
	
	for(float i=0.0; i<n; i++) {
		// Tent map
		x = r*x*(10.+3.5*cos(time*1e-3) - x);
		
	}
	
	gl_FragColor = vec4( x, tan(x), fract(x), 1.0 );

}