// amiga copper candy bar .. gigatron France ;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



vec3 candybar(vec2 uv,float p){
	
	
       uv = 60.*gl_FragCoord.xy /resolution.xy-p;		
       vec3 col = vec3( 1.0 * 4.0-uv.y+1.0)  *uv.y*0.1  ;
   
       uv.y -=time*2.8;
       if(  mod( uv.y , 2.0 ) > 0.8 ) col.xy=vec2(0.0,0.0);
	
	
	
	return col;
}



void main(){
    
       vec2 p =  gl_FragCoord.xy /resolution.xy ;	
	 
       vec3 col = candybar(p,20.+20.*abs(1.4*sin(time))); // pos
   
       
	gl_FragColor = vec4( col, 1.0 );
}