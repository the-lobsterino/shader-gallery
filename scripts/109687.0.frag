// 050720N Simplified

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main()
{
	vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	
	for(float i=1.;i<6.;i++)
	{
		p.x += .5/i*sin(i*p.y+time)+1.;
		p.y += .5/i*cos(i*p.x+time)+2.;
	} 
	vec3 col=vec3(sin(p.x), sin(p.y), 1);
	// more colorful:
	// vec3 col=vec3(0.5*sin(3.0*p.x) + 0.5,  0.5*sin(3.0*p.y)+0.5, 0.5*sin(3.0*p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}
