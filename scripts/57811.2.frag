#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
      
	vec3 destColor1 = vec3( 0.0 , sin(time* 10.0) , 1.5 ); 
	vec3 destColor2 = vec3(sin(time* 10.0), 0.2 , sin(time* 10.0)); 
	
	vec2 p1 = gl_FragCoord.xy / resolution;
	p1.y = p1.y - (sin(time*3.0)*0.5+0.5);
	float l1 = sin(time* 1.0) / abs(length(p1));
       
	vec2 p2 = vec2( 1.0 , 1.0 ) - gl_FragCoord.xy / resolution; 
	float l2 = sin(time* 1.0) / abs ( length (p2) );
	
	
	gl_FragColor = vec4(l1*destColor1 + l2*destColor2 , 1.0) ;
	
		  
}