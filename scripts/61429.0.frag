#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main()
{
	vec2 p=5.90*(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<13;i++)
	{
		vec2 newp=p;
		float speed = 0.000001; // speed control
		newp.x+=1./float(i)*sin(float(i)*p.y+time/(speed)+2.3*float(i))+1.0;
		newp.y+=1./float(i)*cos(float(i)*p.x+time/(speed)+2.3*float(i))-1.4;
		p=newp;
	}
	vec3 col=vec3(0.0,.3*sin(3.0*p.y)+0.7,sin(p.x+p.y));
	gl_FragColor=vec4(col, 5);
}
