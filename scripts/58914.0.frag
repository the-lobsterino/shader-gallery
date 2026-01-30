// gigatron adds ; 
#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

float t;
	t = time * 2.59;
    vec2 r = gl_FragCoord.xy/resolution.xy ;
    vec2 o = 1.8*r-vec2(1.10+sin(r.x+3.14),0.85) ;
    //o = vec2(length(o*o) - r.x - .02,1.5+t+atan(o.x*1.2,o.y*0.8)*6.);   
 
	
	o = vec2( length(o) - r.x +atan(o.x*0.0,1.-o.y),atan(o.x*1.2,o.y*.8)*6.);  
	
    
    vec4 s = 0.08*cos(1.5*vec4(0,1,2,3) - (-t*3.)+ o.y + sin(o.x+t*2.0) ),
    e = s.yzwx;
	 vec4 f = max(o.x-s,e-o.x)  ;
	 
	for (float i=0.0;i<6.0;i++){
		
		
	      f += .6*max(o.x-s-i*0.2,.05-e-o.x)-i/100.;
	     
		
}
		
    gl_FragColor = dot(clamp( f*r.y,0.,0.25), 180.*(s+e)) * (s-.2)-f ;

}