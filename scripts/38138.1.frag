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
       
    // copper function = (screen, pos.y, bold)	
	
    float cop1  = copper(uv,vec2(0.,0.65-0.2*fract(uv.y*15.-(time*8.))),0.50);
	  cop1 += copper(uv,vec2(0.,0.05-0.2*fract(uv.y*15.+(time*8.))),0.50);
	
  
        // r component
	gl_FragColor = vec4(cop1*sin(time),cop1*sin(0.5*time),cop1*cos(0.4+time),1.0);
	// b component 
	
}