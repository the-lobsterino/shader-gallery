#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float cc (float c )
	
{
	  float r = floor( 2.0*(gl_FragCoord.x )*0.2) + time *0.08;
		  
   	  c =  0.95-(abs(sin(0.02*time-gl_FragCoord.y+r * 20.0)) * 0.5 ) * 2.;
	
	  return  c+c;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy - 0.5 * resolution) / min(resolution.x, resolution.y);
	vec3 c = vec3(0.005, 0.0021, 0.009); // BG color
	vec3 lightCol = vec3(0.4 , 0.4, 0.4  );
    	float timer = time+1.0;
	timer =0.0;
	for(int i = 0; i <40; ++i) {
		
		timer = time+1.0;
        	float t = 0.8 * 3.14 * float(i) / 5.+time  ;
        	float x = cos(t)*0.4 ;
        	float y = sin(t) ;
		float yy = sin(-t) ;
        	vec2 o = .5 * vec2(x   -  y, y);
		vec2 r = .5 * vec2(x   +  y, y);
		vec2 s = .5 * vec2(yy*1.5   , x*.6);
		
		// demo sequences :!
        	if(timer>2.0)  { c += 0.02 / (length(p -(o))) * lightCol * 0.2;}
		if(timer>5.0) {  c += 0.02 / (length(p -(r))) * lightCol * 0.2;}
		if(timer>10.0) { c += 0.02 / (length(p -(s))) * lightCol * 0.2;}
		
		if(timer>=15.0) {lightCol = 0.9*vec3(0.8 , 0.8, 0.2  );}
		
		if(timer>=20.0) {lightCol = 0.8*vec3(0.0 , 0.8, 0.8  );}
		
		
		
	}
	 
	
	gl_FragColor = vec4(c*c*c*c*c*cc(c.r),1.);
}