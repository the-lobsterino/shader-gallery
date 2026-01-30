#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4( 1.0 );
	
	vec2 p = 2.5*surfacePosition;
	vec2 r = vec2(length(p), atan(p.x, p.y));
	
	// mock amazon-aws loading animations
	if(mouse.x < .5){
		// blue trapezoids
		float ry = fract(4.*r.y/3.141592653);
		if(r.x > .22 && r.x < .4 && ry < 0.9){
			gl_FragColor.rg *= vec2(0.7, .8);
			if(abs(floor(8.*(fract(-time/5.)-.5))+floor(4.*(r.y/3.141592653))) < 0.5){
				gl_FragColor *= 0.4+gl_FragColor*0.4;
			}
		}
	}else{
		// black arrows
		r.y = fract((-time*1.3+pow(cos(time*2.), 2.)*0.5+r.y)/3.141592653);
		if(r.x > .22 && r.x < .4 && r.y < 0.75 && r.y > .125){
			gl_FragColor.rgb *= 0.;
		}
		if(r.y < 0.95 && r.y > 0.75){
			float yspan = abs(r.y-.75);
			// goal: use abs to make a triangle
			//		point: angle=.95, radius = .5*(.22+.4)
			//		limits: angle=.75, radius in [0.1 ... .52]
			
			// v-- (poorly) close enough
			r.x += yspan;if(r.x > .22 && r.x < .52){gl_FragColor.rgb *= 0.;}
		}
	}
	
}