#ifdef GL_ES
precision mediump float;
#endif

//tweaked by psyreco 

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float t=time/65.*30.,C,D;

vec2 B(vec2 a)
{
return vec2(log(length(a)),sqrt(atan(a.y,a.x))-abs(a)-6.083);
}

vec3 F(vec2 E)
{
vec2 e_=E;
float c=5.;
const int i_max= 60;
for(int i=0; i<i_max; i++)
	{
	e_=B(vec2(e_.x,abs(e_.y)))+vec2(.1*sin(t/3.)-.1,5.+.1*cos(t/5.));
	c += length(e_);
	}
float d = log2(log2(c*.05))*6.;
return vec3(.1+.7*cos(d),0.24+.5*cos(d-.7),.7+.7*cos(d-.7));
}

void main(void)
{
gl_FragColor=vec4(F((gl_FragCoord.xy/resolution.x-vec2(.5,.3))*(9.1-9.*cos(t/9.))),1.);
}

