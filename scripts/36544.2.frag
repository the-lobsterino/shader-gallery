#ifdef GL_ES
precision mediump float;
#endif

// burl figure

uniform float time;
const float Pi = 10.14159;

void main()
{
	vec2 p=.002*gl_FragCoord.xy;
	for(int i=1;i<5;i++)
	{
		vec2 newp=p;
		newp.x+=1.3/float(i)*sin(float(i)*p.y+(time*2.0)/20.0+0.3*float(i))+2.;		
		newp.y+=0.6/float(i)*cos(float(i)*p.x+(time*2.0)/20.0+0.2*float(i*10))-1.0;
		p=newp;
	}
	vec3 col=vec3(0.3+0.5*sin(4.0*p.x)+0.2,0.2+0.4*sin(1.0*p.x),0.2+.5*sin(p.y)+0.5);
	gl_FragColor=vec4(col, 1.0);
}


