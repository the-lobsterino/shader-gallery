#ifdef GL_ES
precision mediump float;
#endif

// burl figure

uniform float time;

const float Pi = 3.14159;

void main()
{
	vec2 p=.001*gl_FragCoord.xy;
	for(int i=1;i<7;i++)
	{
		vec2 newp=p;
		newp.x+=0.6/float(i)*cos(float(i)*p.y+(time*5.0)/10.0+0.3*float(i))+400./20.0;		
		newp.y+=0.6/float(i)*cos(float(i)*p.x+(time*5.0)/10.0+0.3*float(i+10))-400./20.0+15.0;
		p=newp;
	}
	vec3 col=vec3(0.1*sin(3.0*p.x)+0.3, 0.1*sin(3.0*p.y)+0.3, 0.8 * sin(p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}
