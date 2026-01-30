// custom Amiga copper gigatron 2017
// basic way for unic  copper ; 
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// custom copper gigatron
float copper(vec2 uv, vec2 pos,float b){

 	float d  = distance(vec2(uv.x,pos.y),uv-pos);
        float cl = 1.0-(smoothstep(0.004,b,d)); 
        return cl;
}  
 

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
     
	float t=time*0.1 ;
	
    // copper function = (screen, pos.y, bold)	
	
    float cop1 = copper(uv,vec2(0.,0.28),0.98);
    
        
	gl_FragColor = vec4(cop1*sin(uv.x*t+0.5+t*100.),0.0,0.0,1.0);
	gl_FragColor += vec4(0.0,cop1*sin(uv.x*t+4.0+t*80.),0.0,1.0);
        gl_FragColor += vec4(0.0,0.0 ,cop1*sin(uv.x*t+1.0+t*60.),1.0);	
	
	gl_FragColor += vec4(0.0,cop1*sin(uv.y*t+4.0+t*40.),0.0,1.0);
        gl_FragColor += vec4(0.0,0.0 ,cop1*sin(uv.y*t+1.0-t*20.),1.0);	
	
}