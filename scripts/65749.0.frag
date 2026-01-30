#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
#define PI 3.14159265359

float poly(vec2 uv,vec2 p, float s, float dif,int N,float a){
    // Remap the space to -1. to 1.
    vec2 st = p - uv ;
    // Angle and radius from the current pixel
    float a2 = atan(st.x,st.y)+a;
    
    
    
    float N_float = float(N);
    float r = PI*2.0/N_float;
    float d = cos(floor(.5+a2/r)*r-a2)*length(st);
    float e = 1.0 - smoothstep(s,s+dif,d);
    return e;
}

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 uv = gl_FragCoord.xy / resolution;
    float fix = resolution.x/resolution.y; 
    uv.x*=fix;
	uv = fract(uv*=.7+time*0.25);
    
	vec2 mov = vec2(sin(time)*1.2,cos(time)*0.2); 
     uv+=mov;
	
	
    float e = poly(uv,vec2(0.5),0.1,0.1,3,time);
     vec3 fin = vec3(e); 
    
    float osc1 = sin(time+uv.x*10.*PI);
    float osc2 = sin(time-uv.y*5.*-PI)*0.5+0.5;
    float oscfinal = sin(time+uv.y*50.*PI)*0.5+0.5 + osc1 + osc2;
    

	gl_FragColor = vec4(oscfinal,(e),oscfinal,1.0);
	

}