#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main()
{
	vec2 p=1.5*(2.0*gl_FragCoord.xy-resolution)
		/max(resolution.x,resolution.y);
	
	for(int i=1;i<10;i++)
	{
		vec2 newp=p;
		float speed = 10.0; // speed control
		newp.x+=0.6/float(i)*sin(float(i)*p.y+time/(100.0/speed)+0.3*float(i))+1.0;
		newp.y+=0.6/float(i)*sin(float(i)*p.x+time/(100.0/speed)+0.3*float(i+10))-1.4;
		p=newp;
	}
	vec3 col=vec3(0.5*sin(34.0*p.x)+0.8,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}
