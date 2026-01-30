#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Amiga custom copper gigatron
float copper(vec2 uv, vec2 pos,float b){

 	float d  = distance(vec2(uv.x,pos.y),uv-pos);
        float cl = 1.0-(smoothstep(0.008,b,d)); 
        return cl;
}  


void main()
{ 
    
   
   float t = mod(time/12.0,1.0);//  no sine here !!
    
    float t2 = -mod(time/5.,0.07);//  no sine here !!
    
     int copst = int(floor(t * 7.0));
    
    vec2 cl = gl_FragCoord.xy / resolution.xy;
   
    for(float yy=-1.0;yy<18.0;yy++){
    
       float cop1 = copper(cl+t2,vec2(0., (yy/30.)),0.03);
       float cop2 = copper(cl-t2,vec2(0., (yy/30.)),0.03); 
        
  
        if(cl.x<0.1)              { gl_FragColor += vec4(cop1,0.,0.,1.0);}
        if(cl.x>0.1 && cl.x<0.2)  { gl_FragColor += vec4(0.,cop2,0.,1.0);}
        if(cl.x>0.2 && cl.x<0.3)  { gl_FragColor += vec4(0.,0.0,cop1,1.0);}
        if(cl.x>0.3 && cl.x<0.4)  { gl_FragColor += vec4(cop2,cop2,0.0,1.0);}
        if(cl.x>0.4 && cl.x<0.5)  { gl_FragColor += vec4(0.0,cop1,cop1,1.0);}
        
        if(cl.x>0.5 && cl.x<0.6)  { gl_FragColor += vec4(0.,cop2,0.,1.0);}
        if(cl.x>0.6 && cl.x<0.7)  { gl_FragColor += vec4(cop1,0.0,cop1,1.0);}
        if(cl.x>0.7 && cl.x<0.8)  { gl_FragColor += vec4(cop2,cop2,0.0,1.0);}
        if(cl.x>0.8 && cl.x<0.9)  { gl_FragColor += vec4(0.0,cop1,cop1,1.0);}
        if(cl.x>0.9 && cl.x<1.0)  { gl_FragColor += vec4(cop2,cop2,cop2,1.0);}
        
        
    /*    
        if (copst == 0) { fragColor += vec4(cop1,0.,0.,1.0);}
        if (copst == 1) { fragColor += vec4(0.0,cop1,0.0,1.0);}
        if (copst == 2) { fragColor += vec4(0.0,0.0,cop1,1.0);}
        if (copst == 3) { fragColor += vec4(cop1,cop1,0.,1.0);}
        if (copst == 4) { fragColor += vec4(0.0,cop1,cop1,1.0);}
        if (copst == 5) { fragColor += vec4(cop1,0.0,cop1,1.0);}
 */
	
    }
   
	
}