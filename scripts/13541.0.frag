  #ifdef GL_ES																							
 precision mediump float;                                                                               
 #endif                                                                                                 
 //by san                                                                                                       
uniform float time;
uniform vec2 resolution;
 
 
 void main( void ) {      

 	vec2 screenSize = resolution;

float p1r = 0.4;
float p1g =1.0; 
float p1b = 0.93;
 
float pr =1.06;  
float pg = 0.04;  
float pb =0.47; 


	 vec2 p = vec2(gl_FragCoord.x/screenSize.x, gl_FragCoord.y/screenSize.y);
     gl_FragColor = vec4(pr*((1.-p.x)*(1.-p.y)), pg*((1.-p.x)*(1.-p.y)), pb*((1.-p.x)*(1.-p.y)), 1.0 ) 
      +vec4(p1r*((p.y)*(1.-p.x)), p1g*((p.y)*(1.-p.x)), p1b*((p.y)*(1.-p.x)), 1.0 )                                                                                                     
        +vec4(p1r*((p.x)*(p.y)), p1g*((p.x)*(p.y)), p1b*((p.x)*(p.y)), 1.0 )                                                                                                    
          +vec4(pr*((1.-p.y)*p.x), pg*((1.-p.y)*p.x), pb*((1.-p.y)*p.x), 1.0 )
	     
	     ;
	 
     }  