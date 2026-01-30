#ifdef GL_ES
precision mediump float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4( 1.0 );
	
	vec2 p = surfacePosition;
	vec2 r = vec2(length(p), atan(p.x, p.y));
	
	// mock amazon-aws loading animations
	
		// blue trapezoids
		r.y = fract(time+4.*r.y/3.141592653);
		if(r.x > .22 && r.x < .4 && r.y < 0.9){
			gl_FragColor.rg *= vec2(0.7, .8);
		
		}
	}
	
