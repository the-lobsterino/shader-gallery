// https://www.shadertoy.com/view/MsyyDD   // merry

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 

void main(void)
{
    	gl_FragColor = vec4(0.0); 
	vec2 p =gl_FragCoord.xy; 
	 
	
         vec2 r = resolution.xy ;
	 vec2 v = floor(vec2(time*0.8,0.0)+p.xy / vec2(r.x/r.y*0.95, 60.0)*4.);
		
	 float red = mod(v.x + v.y, 2.);
       
	 gl_FragColor = vec4(red,0.2,v.y-20.+sin(time)*0.5 +0.5 , 1);
     
}