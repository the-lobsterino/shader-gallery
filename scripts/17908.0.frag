#ifdef GL_ES
precision mediump float;
#endif

//
//from https://www.shadertoy.com/view/4slXzB
//

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NB 70.
#define MODE1
float circle(vec2 center , float radius,float thickness,float la,float ha)
{
	float f = length(center);
	
	float a = atan(center.y,center.x) ;
	return(smoothstep(f,f+0.01,radius) * smoothstep(radius - thickness,radius - thickness+0.01,f) * step(la,a)*step(a,ha));
}

float cable(vec2 p,float dx,float dy,float r,float thick,float la,float ha)
{
	p.x-=dx;
	p.y -= dy;
	return (circle(p,r,thick,la,ha));
}

void main(void)
{
	
	
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec2 p = -1. + 2. * uv;
	p.x*=resolution.x/resolution.y;
	#ifdef MODE1
	vec2 ap = p * vec2(-1.,-1.);
	#else
	vec2 ap = p * vec2(1.,-1.);
	#endif
	
	float f = 0.;
	for(float i = 0.; i < NB; ++i)
	{
		float divi = i/NB;
		f += cable(p,0.,0.,.99 - divi,.025,0.,(sin(time -time * divi*5.)*.5+.5) * 3.14);
		f += cable(ap,0.,0.,.99 - divi,.025,0.,(1. - (sin(time -time * divi*5.)*.5+.5)) * 3.14);
	}
	vec3 col = mix(vec3(0.,0.,0.),vec3(1.,1.,1.),f);
	
	gl_FragColor = vec4(col,1.0);
}