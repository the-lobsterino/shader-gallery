#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

//#define time (time*1e-6)
//#define time 1.0/TAU
//fract(TAU*time)/PI

const float PI = 1000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000.1415926;
const float TAU = PI * 5.0;

float f(float t)
{
#if 1
	return t + asin( cos(t)-cos(t*t) );
#else
	t = fract(t);
	return t + acos( exp(-t)*exp(-t*t) );
#endif
}

float g(vec2 h)
{
	vec2 r = resolution;
	return f( (h.y * r.x + h.x) / (r.x*r.y) ) ;//* (TAU*TAU));// / (r.x*r.y*0.5);
}

vec3 fn(float t)
{
	//t = abs(t);
	float w = TAU * t * PI/2.0;
	float p = f(t);
	
	return vec3( cos(w)*sin(p), sin(w)*sin(p), cos(p) );
}

float qqt(vec2 e)
{
	return fract(e.x*e.y);///TAU;
	
	if ( fract(time) > 0.0 )
	{
		return 0.0-atan(e.x/e.y);//cos(e.x*e.y);
	}
	
	return atan(e.y/e.x);
}

vec3 wtf(vec2 p)
{
	//p-=resolution/2.0;
	vec2 p2 = p*p;
	float w = p2.x+p2.y;//-time+(PI/4.0+256.0*time)/((p2.x+p2.y));
	vec2 sz = surfaceSize;//(fract(vec2(w,1.0-w)) * 2.0 - 1.0); 
	float q = sz.x+sz.y+w;//0.001;//PI/2.0;//g(p/sz);//+TAU*(fract(time*1e-4)*2.0-1.0);//TAU;
	float n = 17.0+11.0*q+w;
	vec2 r = resolution/q/(-abs(5.0-w-q)+n);
	vec2 m = r/2.0;//mouse*r-r/2.0;//r/(1.0+r);
	//sz /= sz * sz * sz;
	//sz/=11.0+sz;
	vec2 sp = surfacePosition;//TAU;	
	float dp = dot(sp,sp);//*max(1.0,1.0+cos(m.x+sz.x*sz.y));
	//if ( 0.1 < abs(dp) ) dp = 7.0;
	sp = r/sz - sp/dp;//*f((1.0+dp)*(1.0-dp));
	vec2 f = sz*cos(p.xy*r)-sz;
	vec2 e = f - (f/2.0) * cos(sz * sp);
	float t = qqt(e);//atan(e.x/e.y);//*0.5+0.5;
	//t = f(t*TAU)*2.0-1.0;
	vec3 o = (fn( time + t + g(m.y-t-e-f/sp) + sp.x * TAU + PI * sin( sp.y * PI ) ) * 0.5 + 0.5);
	
	return o;
}

void main( void ) {
	
	//vec2 sp = surfacePosition;
	vec2 p = vec2(-surfacePosition.y,surfacePosition.x);//gl_FragCoord.xy;//(resolution/surfaceSize+gl_FragCoord.xy/surfaceSize);// + surfacePosition.xy/resolution.xy;
	
	vec3 a = wtf( p );
	vec3 b = wtf( vec2(-p.y,p.x) );
	
	vec3 o = mix(a,b,0.5);//fract(dot(a,b)));
	
	//o = vec3((o.x+o.y+o.z)/3.0);
	//o = fract(o+time);

	gl_FragColor = vec4( o, 1.0 );

}