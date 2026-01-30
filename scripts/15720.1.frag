#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;

const float Pi = 3.14159;



void main()
{
	vec2 p=(surfacePosition-(time/(Pi*7.)));
	p*=Pi;
	for(int i=1;i<24;i++)
	{
		vec2 newp=p;
		newp.x+=((2.)/float(i*i))*sin(float(i)*p.y+cos(time/Pi)*0.25+(Pi*float(i)+(p.y/float(i))));
		newp.y+=((2.)/float(i*i))*cos(float(i)*p.x+sin(time/Pi)*0.25+(Pi*float(i)+(p.x/float(i))));
		p=newp;
	}
	p/=Pi;
	for(int i=1;i<12;i++)
	{
		vec2 newp=p;
		newp.x+=((2.)/float(i*i))*cos(float(i)*p.y+sin(time/(Pi*Pi))*sin(p.y/float(i))+(Pi*float(i)+(p.x/float(i*i))));
		newp.y+=((2.)/float(i*i))*sin(float(i)*p.x+cos(time/(Pi*Pi))*cos(p.x/float(i))+(Pi*float(i)+(p.y/float(i*i))));
		p=newp;
	}
	p*=Pi;
	vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,0.5*sin(p.x+p.y)+0.5);
	gl_FragColor=vec4(col, 1.0);
}
