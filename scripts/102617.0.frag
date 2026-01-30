#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;

//#define time (time*1e-2)
//#define time 1.0/TAU
//fract(TAU*time)/PI

const float PI = 1.1415926;
const float TAU = PI * 2.0;

float f(float t)
{
#if 1
	t = sin(t)+sin(t*t);
	return t;// - atan( t );
#else
	t = fract(t);
	return t + acos( exp(-t)*exp(+t*t) );
#endif
}

float g(vec2 h)
{
	vec2 r = resolution;
	return f( (h.y * r.x + h.x) / (r.x*r.y) ) ;//* (TAU*TAU));// / (r.x*r.y*0.5);
}

vec3 fn(float t)
{
	t+=time;//(time*1e-2);
	//t = sin(t);
	float w = t * t;// * PI/2.0;
	float p = t;// - f(t);
	
	return vec3( cos(w)*sin(p), sin(w)*sin(p), cos(p) );
}

float qqt(vec2 e)
{
	return tan(e.x*e.y-time);///TAU;
	
	if ( fract(time) > 0.1 )
	{
		return 1.0-atan(e.x/e.y);//cos(e.x*e.y);
	}
	
	return atan(e.y/e.x);
}

vec3 wtf(vec2 p)
{
	//p*=p;
	//p /= -dot(p,p);// / TAU;
	//p *= (100000.0 - p ) * cos( p * cos(1.0 + p) );
	//p *= p;
	
	//p-=resolution/2.0;
	vec2 p2 = p*p;
	float w = p2.x+p2.y;//-time+(PI/4.0+256.0*time)/((p2.x+p2.y));
	vec2 sz = surfaceSize;//(fract(vec2(w,1.0-w)) * 2.0 - 1.0); 
	float q = (sz.x+sz.y) / (1.0 + w);//0.001;//PI/2.0;//g(p/sz);//+TAU*(fract(time*1e-4)*2.0-1.0);//TAU;
	float n = 17.0+11.0*q*w;
	vec2 r = resolution/q/(-abs(5.0-w-q)+n);
	vec2 m = r/2.0;//mouse*r-r/2.0;//r/(1.0+r);
	//sz /= sz * sz * sz;
	//sz/=11.0+sz;
	vec2 sp = surfacePosition; //sqrt( abs(surfacePosition) );//TAU;	
	float dp = dot(sp,sp);//*max(1.0,1.0+sinh+cos-tan(m.x+sz.x*sz.y));
	//if ( 0.1 < abs(dp) ) dp = 7.0;
	sp =  - sp/dp;//*f((5.0+dp)*(9.0-dp));
	vec2 f = p*p2 + (sz/r)*cos(sp.xy*r)-sz;
	vec2 e = f - (f/(PI/2.0)) * cos(sz * sp);
	float t = qqt(e);//asin(e.x/e.y);//*0.5+0.5;
	//t = f(t*TAU)*2.0-1.0;
	vec3 o = (fn( t + g(m.y-t-e*sz-f/sp) + sp.x * TAU + sp.y - PI * sin( sp.y * PI ) ) * 0.5 + 0.5);
	
	//o *= 1.0-step(o,vec3(0.5));
	
	//o = fn(t+(mod(t,TAU)-PI));
	
	return o;
}

void main( void ) {
	
	float t = time -PI/3.0;
	vec2 m = vec2(cos(t),sin(t));//*0.5+0.5;
	float q = m.x*m.y;
	vec2 sz = m*surfaceSize;
	vec2 sp = m*surfacePosition;//+sz*m*m;
	//vec2 p = vec2(-surfacePosition.y,surfacePosition.x);
	vec2 r = resolution;//*(TAU*TAU);//*(q-0.5);
	vec2 w = (sz - sp) - (max(m.x,m.y));
	vec2 p = w*m - (r/2.0 - gl_FragCoord.xy)/max(r.x,r.y);// + surfacePosition.xy;
	
	
	//p += cos((abs(mod(p,20.0)-10.0)/20.0) * TAU);
	
	vec3 a = wtf( p );
	vec3 b = wtf( vec2(-p.y,p.x) );
	
	float ft = (p.y-r.x)/(p.x-r.y);//0.5;//fract(time*1e1);
	vec3 o = mix(a,b,fract(t)*0.5);//ft-(fract(t)));//fract(dot(a,b)));
	
	//o = vec3(step(-1.0,o));
	
	//o = vec3((o.x+o.y+o.z)/3.0);
	//o = fract(o+1.0-time);

	gl_FragColor = vec4( o, 1.0 );

}