#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec4 r(float t,float c)
{
	vec2 pos=((gl_FragCoord.xy-resolution.xy*0.5)/resolution.y)*2.0;
	vec2 p=vec2(sin(t*1.0)*cos(t*1.52),cos(t*1.1)*sin(t*1.52));
	
	
	return vec4(pow(0.5,10.0*distance(pos,p)))
		*sin(c);
		;
}
		    
void main( void )
{
	vec4 color=vec4(0.0);
	for (float c=0.0; c<30.0; c+=0.3)
		color+=r(time+c,c);
	gl_FragColor=color;
}