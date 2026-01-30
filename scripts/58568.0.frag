// gigatron
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = ( gl_FragCoord.xy-0.5* resolution.xy ) /resolution.y;
	
	
	float tt = time;

	vec3 cl = vec3(0,0,0);
	
	float xx = sin(tt)*0.5;
	float yy = cos(tt)*0.3;
	
	float r = 0.3 ;
		 
	for (float ii=0.5;ii<18.;ii++){
	
	float rr = 1.-smoothstep(r,r+0.005,length(p-vec2(-.5+xx,yy*0.9)));
		
	float gg = 1.-smoothstep(r,r+0.005,length(p-vec2(0.0-xx,yy*0.5)));	
		
	float bb = 1.-smoothstep(r,r+0.005,length(p-vec2(0.0+xx,yy*.4)));	
		
		r =r+ii/300.;
	
	  cl += vec3(rr/ii,gg/ii ,bb/ii )/ii*5.0;
	 
	}
	
	
	
	
	gl_FragColor = vec4( cl, 1.0 );

}