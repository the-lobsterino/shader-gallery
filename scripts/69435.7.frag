#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float rnd(vec2 uv, float n) {
         uv -= .5*n;
	return mod(sin(34556.456*uv.x-457523.345*uv.y)*345674.54,1.);
}




void main( void ) {
	
		
	vec2 pos = gl_FragCoord.xy/resolution.xy ; 
	
	
	vec4 B = vec4(0.,0.,0.,1.0);
	vec4 W = vec4(1.,1.,1.,1.0);
	vec4 c1,c2,c3,c4;
	
	
	float f1,f2,f3,f4;
	
	
	vec4 firstColor = vec4(1.,1.,0.,1.0);
	vec4 secondColor = vec4(0.0,1.0,0.0,1.0);
	vec4 thirdColor = vec4(1.0,0.0,1.0,1.0);
	vec4 forthColor = vec4(0.0,0.0,1.0,1.0);
	
	vec2 first = vec2(0.0,1);
	vec2 second = vec2(1,1);
	vec2 third = vec2(0.0,0.0);
	vec2 forth = vec2(1,0.0);

	
	vec2 r1 = pos-first;
	vec2 r2 = pos-second;
	vec2 r3 = pos-third;
	vec2 r4 = pos-forth;
	

	
		float d12,d13,d14,d23,d24,d34;
  d12 = distance(first,second);
  d13 = distance(first,third);
  d14 = distance(first,forth);
  d23 = distance(third,second);
  d34 = distance(third,forth);
  d24 = distance(forth,second);
		  float minr1,minr2,minr3,minr4;
    minr1 =0.5*min(min(d12,d13),min(d12,d14));
        minr2 =0.5*min(min(d12,d23),min(d12,d24));
            minr3 =0.5*min(min(d23,d34),min(d23,d13));
                minr4 =0.5*min(min(d14,d24),min(d14,d34));
		
		
		
		
			if(length(r1)<= minr1){
  
  c1 = mix(firstColor,0.6*(firstColor+W),length(r1)/1.0);
  
  }else{
  c1 = mix((1.0-0.4*minr1)*firstColor+0.6*minr1*W,W,1.0-0.5/length(r1));
  }
  
  if(length(r2)<= minr2){
  c2 = mix(secondColor,0.6*(secondColor+W),length(r2)/1.0);
  
  }else{
  c2 = mix((1.0-0.4*minr2)*secondColor+0.6*minr2*W,W,1.0-0.5/length(r2));
  }
  
  if(length(r3)<= minr3){
  c3 = mix(thirdColor,0.6*(thirdColor+W),length(r3)/1.0);
  
  }else{
  c3 = mix((1.0-0.4*minr3)*thirdColor+0.6*minr3*W,W,1.0-0.5/length(r3));
  }
  
  if(length(r4)<=minr4 ){
  c4 = mix(forthColor,0.6*(forthColor+W),length(r4)/1.0);
  
  }else{
  c4 = mix((1.0-0.4*minr4)*forthColor+0.6*minr4*W,W,1.0-0.5/length(r4));
  }
   float i1 = dot(r1,second-first)/length(second-first)/length(second-first);
   float i2 = dot(r3,forth-third)/length(forth-third)/length(forth-third);
   vec2 C = first+i1*(second-first);
   vec2 D = third+i2*(forth-third);
   float i3 = dot(pos-C,D-C)/length(D-C)/length(D-C);
		
    //噪声
		
		
		
		
		
		
		
		
		
		
		
		
		
		
		
  
		
	 gl_FragColor = mix(mix(c1,c2,i1),mix(c3,c4,i2),i3);

}