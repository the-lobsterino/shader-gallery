#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
varying vec2 surfacePosition;
uniform float time;

const float Pi = 3.14159;

void main()
{
	vec2 p=surfacePosition*.2+0.1;
	//(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<50;i++)
	{
		vec2 newp=p;
		newp.x+=0.6/float(i)*sin(float(i)*p.y+time*20.0/40.0+0.3*float(i))+1.0;
		newp.y+=0.6/float(i)*sin(float(i)*p.x+time*20.0/40.0+0.3*float(i+10))-1.4;
		p=newp;
	}
	vec3 col=vec3(0.5*sin(3.0*p.x)+0.5,0.5*sin(3.0*p.y)+0.5,sin(p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}
