//  gigatron .. France //
  
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circle(vec2 pos  ){
	
	 float r=0.04;
	
	
	return smoothstep( r, r+0.02 , length(pos) );
	
}


void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

	vec2 q = p ;
	float t=time;
	 
	vec3 color =   vec3(0.0,0.1,0.0) ;
	
	float r = 0.1  ;
	
	for (float i=1.0;i<100.0;i++){
	
	color += 1.-circle(p -vec2(cos(i)-sin(0.25*t*i)*0.04,sin(i)*cos(t))/1.2 );
	
		//color *= circle(p -vec2(cos(i-time),sin(i+time)) );
	 
		
	}
	

	gl_FragColor = vec4( color, 1.0 );

}