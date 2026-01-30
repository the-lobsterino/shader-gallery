#ifdef GL_ES
precision highp float;
#endif

uniform vec2      mouse;
uniform vec2      resolution;
uniform sampler2D renderbuffer;
uniform float time;

#define PI	(4.*atan(1.))

//the function is most "PI" like as is below, but comment out the useless pi and comment in x+=mouse.x

float fsin(float x)
{
//	x /= PI;
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*2.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}

float fcos(float x)
{
	
	//x 	= (x/PI)+.5;
	x	+= mouse.y+mouse.x;
	bool p  = fract(x*.5)<.5;
	x	= fract(x)*2.;
	x 	*= 2.-x;
	x 	*= 1.-abs(1.-x)*.25;
	return  p ? x : -x;
}

mat2 rfmat(float t)
{	
	float c = fcos(t);
	float s = fsin(t);
	return mat2(c,s,-s,c);
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c,s,-s,c);
}

void main() 
{
	vec2 uv  		= gl_FragCoord.xy/resolution.xy;  
	vec2 position		= (uv*2.-1.) * vec2(resolution.x/resolution.y, 1.);	
	
	
	float tr		= length(position*rmat(time*0.0)-0.001005);
	float fr		= length(position*rfmat(time*0.0)-.5);
	
	float c			= cos(position.x);
	float s			= sin(position.x);
	
	float fc		= fcos(position.x);
	float fs		= fsin(position.x);
	
	
	float w 		= 2./resolution.y;
	vec4 t			= vec4(0., abs(c-position.y) < w || abs(s-position.y)<w,0.,1.);
	vec4 f			= vec4(abs(fc-position.y) < w || abs(fs-position.y)<w, 0., (abs(fs-s)+abs(fc-c)), 1.);
	
	w 			*= 4.;
	vec4 o			= vec4(fr < w, tr < w, w/abs(fr+tr), 1.);
		
	
	f.z			*= 4.;
	o.z			*= 1.;
	f.z *= 0.;
	float g			= float(abs(position.x)<2./resolution.x||abs(position.y)<1./resolution.y) * .25;
	
	gl_FragColor 		= o+g+f+t;
}//sphinx
