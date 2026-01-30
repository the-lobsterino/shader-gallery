#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// custom copper gigatron
vec3 copperV(vec2 uv, vec2 pos,float b,vec3 color){

 	float d  = distance(vec2(uv.x,pos.y),pos)*3.;
        float cl = 1.0-(smoothstep(0.0,b*0.6,d)) ; 
        return color*cl  ;
}  



  vec3 a = vec3(1.0,0.0,0.0);
  vec3 b = vec3(1.0,1.0,0.0);
  vec3 c = vec3(1.0,1.0,1.0);

  vec3 d = vec3(0.0,1.0,0.0);
  vec3 e = vec3(1.0,0.0,1.0);
  vec3 f = vec3(0.0,0.0,1.0);




  mat3  m =mat3(a,b,c);  // matrice vec3 
  mat3  n =mat3(d,e,f);  // matrice vec3 


void main( void ) {

	vec2 uv =  ( gl_FragCoord.xy / resolution.xy )  ;

	// copper bars custom ///////// copper(screen,pos.y,bold,color); 
         vec3 cop1 = vec3(0.0);
       
	for (float i=1.0;i<20.0;i++){
		
		
		cop1 += copperV(uv,vec2(0.5+i/10.0*cos(time+i*0.15)/6.,0.00),0.02,n[0]); // m or n [0]...[2] color data 
		
		
		gl_FragColor = vec4(cop1,1.0);
		
	}
	
    
	
        
}