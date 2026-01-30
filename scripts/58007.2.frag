#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float Pi = 3.14159265359;


float Func(float t)
{
	return ((t>0.4)&&(t<0.6))?0.3*sin((t-0.4)*53.5):0.;
}


void main( void )
{
	vec2 coord = gl_FragCoord.xy/resolution.xy;
	vec3 color =vec3(0.,0.,2.);
	
	float t = time/3.;
	t = t - float(int(t));
	
	float trace = 0.35;
	
	vec2 tmp = vec2(0.0,0.5);
	tmp.x+=t;
	tmp.y+=Func(t);
	tmp+=-coord;
	color.y+=0.006/length(tmp);
	float tr=(tmp.x>0.)?trace-tmp.x:0.0;
	//tr*=(abs(tmp.y)>0.005)?0.:1.;
	tr*=(abs(Func(coord.x)-coord.y+0.5)>0.005)?0.:1.;
	color.y+=tr;
	
	gl_FragColor = vec4(color, 1.0);
}