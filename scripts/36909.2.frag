// quickly  gtr ;
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	gl_FragColor = vec4(0.,.0,0.,0.);// ios !
	
	vec2 p = gl_FragCoord.xy / resolution.xy;
	vec2 q = p  ;
    
        float t=0.8*abs(sin(time*2.));
     
    
	q.x *=resolution.x/resolution.y*.95;	
    
	q.x =(q.x*cos(t))+(q.y*sin(-t))*(q.x*cos(t))+(q.y*sin(t));// wrong formula !!!
	
	vec3 col =vec3(1.0,0.3,0.10);
	
	float r = 0.01*t*2.;
	
  
    
    for(float i=0.0;i<14.0;i++){
    col *= smoothstep( r, r+0.01*t*10., length( q-vec2(0.05+i/7.,0.9) ) );
    col *= smoothstep( r, r+0.01*t*20., length( q-vec2(0.05+i/7.,0.7) ) ); 
    col *= smoothstep( r, r+0.01*t*30., length( q-vec2(0.05+i/7.,0.5) ) );
    col *= smoothstep( r, r+0.01*t*40., length( q-vec2(0.05+i/7.,0.3) ) );
    col *= smoothstep( r, r+0.01*t*50., length( q-vec2(0.05+i/7.,0.1) ) );     
        
    }
        

	gl_FragColor = vec4(fract(0.5+col*t+p.y)/t,1.0);

}