#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )
{
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	uv.x *= resolution.x / resolution.y;
	
	
	float cols = 0.0;
	
	vec2 c=vec2(0.8,0.5) ;
	
	float dis=distance(c,uv) ;
		
	cols=.8-smoothstep(0.31-0.01,0.31+.01,dot(dis,dis)*4.0) ;
	
	
	gl_FragColor = vec4(0.1,0.19,cols*3.0, 1.0);
}