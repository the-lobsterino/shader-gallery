#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main()
{
	vec2 p=3.90*(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<13;i++)
	{
		vec2 newp=p;
		float speed = 5.0; // speed control
		newp.x+=1./float(i)*sin(float(i)*p.y+time/(speed)+.3*float(i))+100.0;
		newp.y+=1./float(i)*cos(float(i)*p.x+time/(speed)+.3*float(i))-100.4;
		p=newp;
	}
	vec3 col=vec3(0.0,.3*sin(.02*p.y)+2.7,sin(p.x+p.y));
	gl_FragColor=vec4(col, .33);
}
