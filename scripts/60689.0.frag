#ifdef GL_ES
precision highp float;
#endif

uniform vec2 resolution;
uniform float time;

void main()
{
	vec2 p=20.5*(0.1*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<50;i++)
	{
		vec2 newp=p;
		float speed = 1.0; // speed control
		newp.x+=0.6/float(i)*sin(float(i)*p.y+time/(10.0/speed)+0.3*float(i))+1.0;
		newp.y+=0.4/float(i)*sin(float(i)*p.x+time/(100.0/speed)+0.3*float(i+10))-1.4;
		p=newp;
	}
	vec3 col=vec3(0.8*sin(p.x*1.0+p.y*0.1),0.4*sin(1.5*p.y)+0.5,sin(p.x+p.y)+0.5);
	gl_FragColor=vec4(col, 0.0);
}
