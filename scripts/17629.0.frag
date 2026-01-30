#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.-1.;

	float c = .0;
	
	for (float i=1.;i<3.;i++) {
		if (p.y>-.7 && p.x>p.y*.3-.2 && p.x<-p.y*.3+.2) {
			
			c=.5;
		}
		
	}
		
	vec3 col = vec3(c);

	gl_FragColor = vec4( col, 1.0 );

}