#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	gl_FragColor = vec4(1);
	
	vec2 p = ( gl_FragCoord.xy / resolution.xy );
	
	p = fract(p+time/4.);
	
	const int clim = 9;
	for(int c = 0; c < clim; c++){
		vec2 np = fract(p*3.);
		if(length(mouse) < float(c)/float(clim)) break;
		if(p.x*3. < 1.){
			gl_FragColor.y /= 2.;
		}
		if(p.x*3. > 2.){
			gl_FragColor.z /= 2.;
		}
		if(p.y*3. < 1.){
			gl_FragColor.y /= 2.;
		}
		if(p.y*3. > 2.){
			gl_FragColor.z /= 2.;
		}
		p = np;
	}
	gl_FragColor.x = (gl_FragColor.y+gl_FragColor.z)/2.;
}