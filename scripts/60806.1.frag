#define pi 3.1415926535897932384626
#define e 2.718281828459045
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float fuck(float f) {
	return sqrt(log(exp(f)));
}
void main()
{	
	float speed = 1.3; // speed control
	vec2 p=20.0*(sin(time*0.1)*2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<10;i++)
	{
		vec2 newp=p;
		
		newp.x+=1./float(i)*sin(float(i)*p.y+time/(speed)+0.3*float(i))+1.0;
		newp.y+=1./float(i)*cos(float(i)*p.x+time/(speed)+0.3*float(i))-1.4;
		p=newp;
	}
	float s = mod(time+20., -pi);
	float x = p.x;
	float y = p.y;
	// sin. fuck. time. ~s.exy
	vec3 col=vec3(mod(pow(e,time),e),e/10.*sin(fuck(time)*pow(p.y,-p.y))+mod(p.x-p.y,e),sin(s+pow(e,x)+y));
	gl_FragColor=vec4(col, 5);
}
