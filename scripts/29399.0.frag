#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 mash(vec2 x)
	{
	return mod(mod(x, -sin(time*0.05))*(1.0/sqrt(5.)), x*1.61803);	
	}

vec2 bash(vec2 x)
	{
	return mod(mod(x, cos(time*x)), sin(x*6.2831853)*x), cos(x*3.141592653);		
	}


void main( void ) 
{
float t=time*0.5;
	
vec2 p=-1.0+2.0*gl_FragCoord.xy/resolution;
p+=mash(p*sin(bash(p*0.01)+t*0.9)-p*cos(mash(p*0.1)+t*0.5));
p*=bash(p);	
vec2 col=abs(fract((p)*1.61803)+t*(mash(p)));
p=mod(p,0.2)*0.5;
col*=mash(col);	
float contrast=2.0+abs(cos(t))*10.0;
gl_FragColor=length(300.0*p*p-normalize(p)*0.2)*vec4(0.05,0.05,0.05,1);
gl_FragColor=(gl_FragColor*contrast)-vec4(fract(exp(mod(col.x,p.y))),fract(exp(mod(col.y,p.x))),0.125,1.0)*contrast*0.75;

}