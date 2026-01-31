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

float f1(float x,float y){
	if((y>0.0)&&(y<0.2*Pi))	
		return sin(time*x*y);
	else
		return 0.0;
}

void main(void)
{
	vec2 p=(20.0*gl_FragCoord.xy)/max(resolution.x,resolution.y);
	
	vec2 p1 = vec2(0.0,0.0);
	p1.x = sin(time*p.x*p.y);
	//p1.x = f1(p.x,p.y);
	vec3 col=vec3(0.5,p1);
	gl_FragColor=vec4(col, 1.0);
}
