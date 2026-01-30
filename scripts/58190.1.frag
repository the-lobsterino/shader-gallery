#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 R = resolution.xy, U= gl_FragCoord.xy;
	vec2 u = gl_FragCoord.xy;
	 u.x = u.x-time*10.0;
         U = 8.*u/R.x;                          
        float a = 1.5*ceil(U.y*4.0*mouse.y) * max(0.,1.-2.*length(U = fract(U*4.0*mouse.y)-.5));  
        U *= mat2(cos(a),-sin(a),sin(a),cos(a));    
	
	gl_FragColor = vec4(smoothstep(-1.,1.,U.y/fwidth(U.y))*0.6 + vec3(0.1, 0.15, 0.4), 1.0);
	    
	   
}
