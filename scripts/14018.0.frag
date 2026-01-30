#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main( void ) 
{
	vec2 p = ( gl_FragCoord.xy / resolution.xy )*2.0-vec2(1.0,1.0);
	vec2 m = (p);
	vec2 col = (p);
	
	m.x = sin(p.x*16.0);
	m.y = sin(p.y*9.0);
	//col.x = m.x*m.y;
	col.y = length(m)*0.5+sin(m.x*24.)/10.0+sin(m.y*13.5)/10.0;
	
	

	
	//col.y = 1.-smoothstep(.5,.7, col.y);
	
	float red = 1.-smoothstep(.1,.7, col.y);
	float green = 1.-smoothstep(.3,.8, col.y);
	float blue = 1.-smoothstep(.6,.99, col.y);
	
	gl_FragColor = vec4(red,green,blue,1.0);
}
