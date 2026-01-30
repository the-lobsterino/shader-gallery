#define STEPS 128
#define PRECISION 0.001

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p)
{
	float t=1.0;
	t=min(t,p.y+1.);
	t=min(t,length(p)+sin(4.0*p.x)+sin(4.0*p.y-time)+sin(4.0*p.z)-1.);
	return t;
}

void main( void ) {
	vec2 uv=gl_FragCoord.xy/resolution*2.-1.;
	uv.x*=resolution.x/resolution.y;
	vec3 d=normalize(vec3(uv, 1));
	vec3 o=vec3(0,0,-5.0);
	float t=0.;
	for(int i=0;i<STEPS;i++)
	{
		float h=map(d*t+o);
		if(h<PRECISION)
		{
			break;
		}
		t+=h;
	}
	gl_FragColor=vec4(1)/t;
}