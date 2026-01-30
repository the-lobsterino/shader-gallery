//tweaked again by psyreco for a never ending beauty kaleidomat
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

float t=time/75.*11.,C,D;

vec2 B(vec2 a)
{
return vec2(log2(atan(length(a))),abs(log2(atan(atan(a.y),atan(a.x))))-radians(5.1)-sin(t)*log2(a));
}

vec3 F(vec2 E)
{
vec2 e_=E;
float c=0.;
const int i_max=12;
for(int i=0; i<i_max; i++)
	{
		if(length(c) > 12.2) break;
	e_=B(vec2(abs((e_.x)),abs((e_.y))))+vec2(.5*sin(t/3.)-.125,5.+.1*cos(t/5.));
	c += tan(length(e_)-t);
	}
float d = abs(log2(log2(c*.125))*4.);
return vec3(.25+.1*sqrt(d),.125+.5*log(d-.2),.4+.2*sin(d-.2));
}

void main(void)
{
gl_FragColor=vec4(F(surfacePosition).brg*1.1,1.1);
}

