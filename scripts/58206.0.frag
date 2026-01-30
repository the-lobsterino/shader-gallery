#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



// variant of https://shadertoy.com/view/MljBDG
// variant of https://shadertoy.com/view/ll2fWG
/*
#define mainImage(O,u)                                          \
	vec2 U = 8.*u/iResolution.y, V; U.x -= iTime; V = floor(U); \
         float s = sign(mod(U.y,2.)-1.);                        \
    U.y = dot( cos(  2.*(iTime+V.x) * (V.y>3.?s:1.)             \
                   * max(0.,.5-length(U = fract(U)-.5)) - vec2(33,0) ), U); \
	O += smoothstep(-1.,1., s*U / fwidth(U) ).y
        
*////


void main( void ) {

	vec2 u = gl_FragCoord.xy;
	vec2 V = gl_FragCoord.xy;
	
	vec2 U = 8.*u/resolution.y; 
	
	
	
	U.x -= time; 
	V = floor(U); 
          
	float s = sign(mod(U.y,2.)-1.);                        
        U.y = dot( cos(  2.*(time+V.x) * (V.y>3.?s:1.)
	      * max(0.,.5-length(U = fract(U)-.5)) - vec2(33,0) ), U);  
	
	gl_FragColor += smoothstep(-1.,100.0, s*U / 0.004 ).y;  // remove fwidth(U)
        

}