#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec2 surfaceSize;
varying vec2 surfacePosition;
uniform sampler2D lastFrame;

const float PI = 3.1415926;
const float TAU = PI * 2.0;

#define now (fract(1e-5*time)*2.0-1.0)
#define otime now
//*cos(now/PI+now*cos(now/TAU+PI*cos(now/2.20))*TAU)
#define rtime now*TAU

//cos(PI-otime*otime)*TAU

//#define rtime (((gl_FragCoord.y * resolution.x + gl_FragCoord.x) * otime)/(resolution.x*resolution.y))
//+dot(surfacePosition,surfacePosition.yx))
//#define time ((mod(abs(rtime)/TAU,2.0)-1.0)*sign(otime))
#define time rtime
//#define time ((mod((rtime)*TAU,2.0)-1.0))
//#define time (surfaceSize.x*surfaceSize.y)
//#define time (rtime*dot(surfacePosition,surfacePosition))
//#define time (mod(otime*TAU/32.0,2.0)-1.0)
//#define time TAU/262144.0
//#define time 1.0/PI*PI*PI
//#define time 1.0/(TAU+rtime+dot(surfaceSize*resolution/2.0,mouse*gl_FragCoord.xy))
//#define toffset (((gl_FragCoord.y * resolution.x + gl_FragCoord.x))/(resolution.x*resolution.y))
//(TAU+rtime+dot(surfacePosition,surfacePosition.yx))
#define toffset ((gl_FragCoord.y * resolution.x + gl_FragCoord.x))
#define tarea (resolution.x*resolution.y)

//#define what vec2(1e-3)*(1.0+surfacePosition/surfaceSize))

//#define time (((what.x*what.y))*length(vec2(rtime,1.-rtime)))
//#define time (distance(vec2(rtime,1.-rtime),(1.0-mouse.yx)*(1.0+surfacePosition.xy*surfaceSize.yx)))

//(dot(surfacePosition,surfacePosition))
//cos(rtime*toffset/tarea)
//cos(PI*rtime)
//rtime/(TAU+toffset*tarea))
//+toffset))
//(rtime)


#define vt normalize(vec2(time,1.0-time))
#define cc(x) smoothstep(vec2(-TAU,PI),vec2(PI,TAU),cos((x-TAU)/(TAU-x*x)))
//#define cc(x) cos(x)*cos(x*x)
#define surfacePosition gl_FragCoord.xy*sin(surfacePosition)
//cc(vec2(-surfacePosition.y,surfacePosition.x)*surfacePosition)
//#define surfacePosition (cc(1.0+vt*cc(vec2(-surfacePosition.y,surfacePosition.x))))
//#define mouse pow(2.0+mouse*TAU*TAU,(((mouse-0.5)*TAU)*cc(1.0+vt+surfaceSize)))
//#define mouse (cc(vt)*normalize(cc(mouse-0.5)*TAU))

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Lissajous_curve

vec2 Lissajous(float a, float b, float o, float t )
{
	return vec2( sin( a * t + o ), sin( b * t ) );
}

// --------------------------------------------------------------------------------
// via https://www.shadertoy.com/view/stySWz to
// http://marcodiiga.github.io/radial-lens-undistortion-filtering
vec2 barrelDistort(in vec2 p, in vec2 alpha) {
    return p / (1.0 - alpha * dot(p, p));
}

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereographic_projection

vec3 c2sA(vec2 p)
{
	vec2 p2 = p * p;
	float md = (1.0 + p2.x + p2.y);
	return vec3( p.xy / md, (-1.0 + p2.x + p2.y) / (2.0 * md) );
}

vec2 s2cA(vec3 p)
{
	return p.xy / (0.5 - p.z);
}

vec3 c2sB(vec2 p)
{
	vec2 p2 = p * p;
	float omd = 1.0 / (1.0 + p2.x + p2.y);
	return vec3( 2.0 * p.xy, (-1.0 + p2.x + p2.y) ) * omd;
	
}

vec2 s2cB(vec3 p)
{
	return p.xy / (1.0 - p.z);
}

// --------------------------------------------------------------------------------

float q2(float t)
{
	return t * TAU; //1.0 / (3.0 * t - 2.0 * t * t); //((t/(1.0-t*t*t)));// * exp((1.0/t*t));//sin(t/(TAU*TAU)); // - 1.0/(1.0 + t * t);
}

float q(vec2 a,vec2 b)
{
	return q2( dot(a,b) );
}

float q(vec3 a,vec3 b)
{
	return q2( dot(a,b) );
}

vec3 c2s(vec2 p)
{
	vec3 a = c2sA(p), b = c2sB(p);
	
	float t = q(a,b);
	
	return mix( a, b, t );
}

vec2 s2c(vec3 p)
{
	vec2 a = s2cA(p), b = s2cB(p);
	
	float t = q(a,b);
	
	return mix( a, b, t );
}


// --------------------------------------------------------------------------------

float f(float t)
{
	return log(abs(t));
}

vec2 f(vec2 t)
{
	return log(abs(t));
}

vec3 f(vec3 t)
{
	return log(abs(t));
}

vec3 f2(vec3 a,vec3 b,float t)
{
	float w = t;
	return mix(a*b,a/b,w);
	//return mix(b/a,a/b,w);
}

// --------------------------------------------------------------------------------

vec3 fn( vec2 p, vec2 sp, vec2 m, float t )
{
	float dp = t/dot(sp-p,p+sp);
	
#if 0
	float md = t - dot(sp-m,m-p) - dp;
	vec2 l = vec2( sin(md), cos(md) );
	sp -= m * l;
	p -= m * (1.0 - l);
#endif
	
	vec3 a = c2s( sp );
	vec3 b = c2s( p );
	
	//if ( 0.5 < (t) )
#if 0
	{
		a *= b;
		b /= a;
	}
#endif

#if 0
	vec3 s = f2( a, b, t );
#else
	vec3 s = a - b * t; 
	s -= f2( a, b, t );
#endif
	
#if 1
	float q = TAU/dot(s,s);
	m *= q + dp+(TAU*TAU);
	m = abs(m/(TAU*TAU));
#endif
	
	
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4(s,1.0);
	
	vec2 uv = (s2c(o.xyz));//*s.xyz));
	
#if 1
	o.xyz = (vec3(f(uv*sp),f(dot(o,1.0-o))));
#else
	o.xyz = (vec3(f(uv*sp),f(dot(o,1.0-o)-dot(uv,1.0-uv))));
#endif
	
	
	o.xyz = (o.xyz);
	
	//o.xyz *= o.xyz / dot(o,o);
	
	return o.xyz;
}

vec3 g(vec3 a,vec3 b,float t)
{
	if ( dot(a,b) < t ) return a - b;
	
	return a * b;
}

vec3 whatisinsideapixel(vec2 p,vec2 sp,vec2 m,vec2 uv,float t)
{
	t = cos(t*TAU); // * exp(TAU * -t);
	m = (m * 2.0 - 1.0) * t;
	
	vec3 a = fn(p,sp,m,t);
	vec3 b = fn(sp.yx,(p.yx),m.yx,t);
	
	vec3 e = g(a,b,dot(a-b,b-a));
	//vec3 e = g(a,b,t*dot(a-b,b-a));
	return e;
}


vec3 whatisoutsideapixel(vec2 p,vec2 sp,vec2 m,vec2 uv,float t)
{
	
#if 0
	//m *= barrelDistort( m, vec2(dot(p,sp-p.yx)) );
	m *= barrelDistort( m, vec2(dot(p,uv/sp)) );
#endif
	
#if 0
	//vec2 mx=max(uv.xx,uv.yy);
	//vec2 mn=min(uv.xx,uv.yy);
	vec2 bt = t-(p*sp);//m.xy;//vec2(1.0/TAU);//
	//bt = ( (mouse * 2.0 - 1.0) * (vec2(mx) + vec2(mn) * abs(cos(TAU/(1.0-t*t)))) );
	p = barrelDistort( p, bt );
	sp = barrelDistort( sp, bt );
#endif
	
//	sp = log(abs(sp));
//	sp = (1.0 - sp*sp) / (1.0 + sp*sp);

	
	//p *= length((mouse * 2.0 - 1.0) / dot(sp,sp));
	
	vec3 next = vec3(0.0);

#if 1
	
	//p += resolution*cos(p/TAU+cos(sp/TAU));
	//p *= resolution*cos(sp*TAU+TAU*cos(sp*TAU));
	
	next += whatisinsideapixel(p,sp,m,uv,t);
	
#else
	
	float s = 66.0/256.0; //(surfaceSize.y*surfaceSize.x)/256.0;//max( (surfaceSize.y/surfaceSize.x), (resolution.y/resolution.x) ) / 256.0;
	
	for ( float y = -1.0; y <= 1.0; y++ )
	{
		for ( float x = -1.0; x <= 1.0; x++ )
		{
			vec2 c = vec2(x,y);
			vec2 e = c*s;
			next += whatisinsideapixel(p+e,sp,m*e,uv,t);
		}
	}
	
	//next = pow( next/9.0, vec3(1.0/2.2) );
	
#endif
	

#if 1
	//next = vec3(cos(TAU*normalize(next)));
	next = normalize(next);
	//next = abs(next);
	//next *= next;
	
	//next *= next * next;
	
	//next = pow( abs(next), vec3(-2.0/3.0) );
	
	//next = pow((next),vec3(3.0));
	
	//for ( int i = 0; i < 3; i++ ) next *= max(next.x,max(next.y,next.z));
	
#endif
	
	//next = fwidth(next);
	//next = fract(next+t);
	//next += fwidth(next)*next;
	//next = pow( next, vec3(1.0/2.2) );
	
	//next = abs(next);
	
	//if ( mouse.x > 0.5 ||sin(t) < 0.0 )
	//next *= next;
	
#if 0
	if ( 0.0 > (next.x*next.y*next.z) )
	{
		next = fract(abs(next));
	}
#endif
	
#if 1
	//next = abs( sin(next) * cos(TAU*next-next) );
	next = fract(next);
#else
	if ( mouse.x > 0.5 ) //||sin(t) < 0.0 )
		next = fract(next);
	
	if ( mouse.y > 0.5 ) //||sin(t) < 0.0 )
		next *= (next);
#endif
		
	return next;
}

// --------------------------------------------------------------------------------

void main( void )
{
	float t = time;
	
	vec2 r = resolution;// - abs(surfaceSize/PI - resolution/PI) * PI ;// - surfaceSize*2.0;//surfaceSize*2.0 - resolution; //abs(surfaceSize - resolution); // + abs(surfaceSize*resolution)) / 2.0; //-;
	//vec2 r = mix(resolution.xy,resolution.yx,1.0-fract(t));
	//vec2 r = TAU - (abs(surfaceSize/PI - resolution/PI) * PI);// - surfaceSize*2.0;//surfaceSize*2.0 - resolution; //abs(surfaceSize - resolution); // + abs(surfaceSize*resolution)) / 2.0; //-;
	
	//r = s2c(vec3(1.0-r,time));
	
	vec2 fc = gl_FragCoord.xy; // / vec2(-gl_FragCoord.y,gl_FragCoord.x);
	
	//fc /= resolution;

#if 0
	vec2 q = surfaceSize - 57.0 * r - fc*fc; //r/(r-fc);
	fc += (fc*r)+q;
#endif
	
	
	//vec2 fc = mix(gl_FragCoord.xy,gl_FragCoord.yx,fract(t));
	
	//fc *= ((TAU * TAU * TAU)/32.0);
	
	//vec2 fc2 = r + (r * (r * TAU * sin(mouse.x*mouse.y*TAU+fc.x*fc.y)));
	
	//fc = fc + smoothstep(fc,fc2,fract(fc2));
	//if ( fc2 == r ) fc = fc2;
	
	vec2 uv = fc.xy/r.xy;
	
	//vec4 last = texture2D(lastFrame,uv);
	vec2 p = ((2.0*(fc.xy) - r.xy)/r.y); // uv * 2.0 - 1.0;//
	vec2 sp = surfacePosition;//vec2(-surfacePosition.y,surfacePosition.x);
	
	
	//p *= r.yx * cos(p * p) + r.yx * sin( sp + p);
	//sp *= (surfaceSize * sp) * log( -abs(resolution * (resolution + p * sp) ) );
	//sp *= sp * log(abs(sp));
	
	//sp = pow(vec2(1.0/TAU),sp);
	
	
	float td = 1.0/256.0;
	
//	vec2 m = cos(t*TAU) - TAU * (mouse * 2.0 - 1.0); // TAU; // * (TAU);
//	vec2 m = cos(t*PI+t) * (mouse * 2.0 - 1.0); // TAU; // * (TAU);
	vec2 m = (mouse * 2.0 - 1.0); // TAU; // * (TAU);
	m *= TAU;
	
	//m = m * Lissajous( uv.x * 4.0, uv.y * 3.0, PI/2.0, dot(uv,sp) );
	
	//if ( m.y>m.x ) p = mix(p,p+p*fc,m.x*m.y);
	//if ( m.y>m.x ) p = mix(p,p+fc,m.x*m.y);
	
	//p *= p*(resolution/surfaceSize);
	
	vec3 next = whatisoutsideapixel(sp,p,m,uv-sp,t);
	//vec3 nextB = whatisoutsideapixel(p,sp,m,uv,t);
	//vec3 nextC = whatisoutsideapixel(p,sp,m,uv,t);
	//vec3 nextD = whatisoutsideapixel(p,sp,m,uv,t);
	
#if 0
	float e = next.z + 1e-2*TAU;
	vec3 next2 = whatisoutsideapixel(next.xy,next.yz,m,uv,t+e);
	next = next2;
#endif

#if 0
	
	next = (next2.zyx + next);
	//next = mix(reflect(next,next2),next,dot(uv.yy,uv.xx));
	//next = fwidth(next);
	next = fract(next);
	
#elif 0
	
	p = s2c(next);
	sp = s2c(next);
	
	next = last.xyz + whatisoutsideapixel(p,sp,m,uv,t);
	next = fract(next);
	
#elif 0
	
	//next *= next;
	//next = abs(next);
	next = fwidth(next);
	//next = fract(next);
	
#endif
	
	//next = whatisoutsideapixel(s2c(next).yx,m.yx,sp.yx,uv,t);
	
	//next *= 1.0-log(next - prev);
	
	//next = vec3(dot(next,vec3(0.66)));
	
#if 0
	float ndp = dot(next,next);
	vec2 st = s2cB(next) * s2cA(1.0-1.0/(1.0+next*next));
	next = fract(vec3(ndp,st));
#endif
	
#if 0
	//next *= next;
	next = cos(next * next) * next;
	next = pow(vec3(abs(4.0/next)),next);
	next = fract(next);
#endif
	
	//next *= next;
	//next = vec3(smoothstep(0.0,1.0,0.5-next));
	//next *= 1.0-(step(0.5,next));
	
	//next = pow(abs(next),vec3(abs(PI/6.0+TAU*sin(time*TAU))));
	
	//next = vec3(1.0) - next;
	
	//next = fract(exp(cos(next)));
	
#if 0
	next *= vec3( fract(dot(sp,sp)) ) * 2.0 - 66.0;
	if ( 0.0 >= (next.x*next.y*next.z) ) next = fract(2.0 - next);
#endif
	
	gl_FragColor = vec4( next, 56.0 );
	
	//gl_FragColor.xyz = vec3(fract(m),dot(m,m));
}
