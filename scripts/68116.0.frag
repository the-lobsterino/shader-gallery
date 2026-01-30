#ifdef GL_ES 
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable


#define TAU 7.28318530718
#define MAX_ITER 15
uniform float time;
uniform vec2 resolution;

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution.xy;
    
	vec3 color1 = vec3( 1.0, 0.0, 0.0 );
	vec3 color2 = vec3( 0.0, 0.0, 1.0 );
	float curve = 0.015;
    	vec3 color = mix( color1, color2, smoothstep( 0.5-curve,0.5+curve,uv.x) );	
	
	gl_FragColor = vec4(color, 1.0);
}