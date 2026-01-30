#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec3 c = vec3( 0.005, 0.0021, 0.009 );
	vec3 lightCol = vec3( 0.2 , 0.43, 0.8 );
    
	for(int i = 0; i <10; ++i) {
		
        	float t = 0.8 * 3.14 * float(i) / 5.0+time  ;
        	float x = cos(t)*0.4 ;
        	float y = sin(t) ;
        	vec2 o = 0.15 * vec2(x   -  y, y);
		vec2 r = 0.15 * vec2(x   +  y, y);
		vec2 s = 0.15 * vec2(y*1.5   , x*0.6);
        	c += 0.02 / ( length(p -(o)) ) * lightCol * 0.3;
		c += 0.02 / ( length(p -(r)) ) * lightCol * 0.3;
		c += 0.02 / ( length(p -(s)) ) * lightCol * 0.3;
		
	}
	
	gl_FragColor = vec4( c*c,1.0 );
	
}