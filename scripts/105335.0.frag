#ifdef GL_ES
precision mediump float;
#endif 

uniform vec2 resolution;
uniform float time;

const float Pi = 3.14159;

float sinApprox(float x) {
    x = Pi + (2.0 * Pi) * floor(x / (2.0 * Pi)) - x;
    return (4.0 / Pi) * x - (4.0 / Pi / Pi) * x * abs(x);
}

float cosApprox(float x) {
    return sinApprox(x + 0.5 * Pi);
}

void main(void)
{
	vec2 p=(2.0*gl_FragCoord.xy-resolution)/max(resolution.x,resolution.y);
	for(int i=1;i<50;i++)
	{
		vec2 newp=p;
		float speed = 100.0; // speed control
		newp.x+=0.6/float(i)*sin(float(i)*p.y+time/(100.0/speed)+0.3*float(i))+1.0;
		newp.y+=0.6/float(i)*cos(float(i)*p.x+time/(100.0/speed)+0.3*float(i+10))-1.4;
		p=newp;
	}
	vec3 col=vec3(0.5*sin(1.0*p.y)+0.4,0.1*sin(0.5*p.y),0.5 + sin(p.x+p.y));
	gl_FragColor=vec4(col, 1.0);
}
