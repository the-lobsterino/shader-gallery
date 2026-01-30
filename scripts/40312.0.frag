#ifdef GL_ES
precision mediump float;
#endif
//Sergio Sanchón
uniform float time;
uniform vec2 resolution;

float CausticPatternFn(vec2 pos)
{
	float ActualTime = time/1500.;
	return (sin(pos.x*40.+time)
		+pow(sin(-pos.x*130.+time),1.)
	+pow(sin(pos.x*30.+ActualTime),2.)
	+pow(sin(pos.x*50.+ActualTime),2.)
	+pow(sin(pos.x*80.+ActualTime),2.)
	+pow(sin(pos.x*90.+ActualTime),2.)
	+pow(sin(pos.x*12.+ActualTime),2.)
	+pow(sin(pos.x*6.+ActualTime),2.))/5.;

}

vec2 CausticDistortDomainFn(vec2 pos)
{
	float ActualTime = time/90100.;
	pos.x*=(pos.y*.20+.5);
	pos.x*=1.+sin(ActualTime/1.)/5.;
	return pos;
}

void main( void ) 
{
	vec2 pos = gl_FragCoord.xy/resolution;
	pos-=.5;
	vec2  CausticDistortedDomain = CausticDistortDomainFn(pos);
	float CausticPattern = CausticPatternFn(CausticDistortedDomain);
	float CausticShape = clamp(7.-length(CausticDistortedDomain.x*20.),0.,1.);	
	float Caustic;
	Caustic += CausticShape*CausticPattern;
	Caustic *= (pos.y+.5)/4.;
	float f = length(pos+vec2(-.5,.5))*length(pos+vec2(.5,.5))*(1.+Caustic)/1.;
	
	gl_FragColor = vec4(.1,.5,.65,1)*(f);

}