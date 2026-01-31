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

#define otime (1e-3*time)
//#define rtime otime
#define rtime (((gl_FragCoord.y * resolution.x + gl_FragCoord.x) * otime)/(resolution.x*resolution.y)+dot(surfacePosition,surfacePosition.yx))
#define time (mod(rtime*TAU,2.0)-1.0)/2.0
//#define time (surfaceSize.x*surfaceSize.)
//#define time (1.0+TAU)
//#define time PI/2.0

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
	return vec3( p.xy / md, (-1.0 + p2.x + p2.y) / (11.0 * md) );
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

float q(vec2 a,vec2 b)
{
	return dot(a,b);
}

float q(vec3 a,vec3 b)
{
	return dot(a,b);
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
	float dp = t*dot(sp,sp);
	
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
	
	vec3 s = f2( a, b, t );
	float q = TAU/dot(s,s);
	m *= q;
	
	m = abs(m);
	
	
	s.xy *= mat2( cos(m.y), -sin(m.y), sin(m.y), cos(m.y) );
	s.yz *= mat2( cos(m.x), -sin(m.x), sin(m.x), cos(m.x) );
	vec4 o = vec4(s,1.0);
	
	vec2 uv = (s2c(o.xyz*s.xyz));
	o.xyz = (vec3(f(uv*sp),f(dot(o,1.0-o))));
	
	
	o.xyz = (o.xyz);
	
	return o.xyz;
}

vec3 g(vec3 a,vec3 b,float t)
{
	if ( dot(a,b) < t ) return a - b;
	
	return a * b;
}

vec3 whatisinsideapixel(vec2 p,vec2 sp,vec2 m,vec2 uv,float t)
{
	t = cos(t*TAU);
	m = (m * 2.0 - 1.0) * t;
	
	vec3 a = fn(p,sp,m,t);
	vec3 b = fn(sp.yx,(p.yx),m.yx,t);
	
	//vec3 e = g(a,b,dot(a-b,b-a));
	vec3 e = g(a,b,t*dot(a-b,b-a));
	return e;
}


vec3 whatisoutsideapixel(vec2 p,vec2 sp,vec2 m,vec2 uv,float t)
{
	
	
#if 0
	vec2 mx=max(uv.xx,uv.yy);
	vec2 mn=min(uv.xx,uv.yy);
	vec2 bt = vec2(1.0/TAU);//
	//bt = ( (mouse * 2.0 - 1.0) * (vec2(mx) + vec2(mn) * abs(cos(TAU/(1.0-t*t)))) );
	p = barrelDistort( p, bt );
	sp = barrelDistort( sp, bt );
#endif
	
	
	//p *= length((mouse * 2.0 - 1.0) / dot(sp,sp));
	
	vec3 next = vec3(0.0);

#if 1
	
	next += whatisinsideapixel(p,sp,m,uv,t);
	
#else
	
	float s = 1.0/256.0; //(surfaceSize.y*surfaceSize.x)/256.0;//max( (surfaceSize.y/surfaceSize.x), (resolution.y/resolution.x) ) / 256.0;
	
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
	next = vec3(normalize(next));
	
	//next = pow((next),vec3(3.0));
	
	//for ( int i = 0; i < 3; i++ ) next *= max(next.x,max(next.y,next.z));
	
#endif
	
	//next = fwidth(next);
	//next = fract(next+t);
	//next += fwidth(next)*next;
	next = pow( next, vec3(1.0/2.2) );
	
	return next;
}

// --------------------------------------------------------------------------------

void main( void )
{
	vec2 fc = gl_FragCoord.xy;
	vec2 uv = fc.xy/resolution.xy;
	vec4 last = texture2D(lastFrame,uv.yx);
	vec2 p = ((2.0*(fc.xy) - resolution.xy)/resolution.y);
	vec2 sp = surfacePosition.yx;
	float t = time;
	float td = 1.0/256.0;
	
	vec2 m = (mouse * 2.0 - 1.0); // TAU; // * (TAU);
	
	m = m * Lissajous( uv.x * 4.0, uv.y * 3.0, PI/2.0, dot(uv,sp) );
	
	vec3 next = whatisoutsideapixel(p,sp,m,uv,t);
	//vec3 nextB = whatisoutsideapixel(p,sp,m,uv,t);
	//vec3 nextC = whatisoutsideapixel(p,sp,m,uv,t);
	//vec3 nextD = whatisoutsideapixel(p,sp,m,uv,t);
	
#if 0
	float e = next.z + 1e-2*TAU;
	vec3 next2 = whatisoutsideapixel(p+p*e,sp,m,uv,t+e);
#endif

#if 0
	
	//next = (next2.zyx + next);
	next = mix(reflect(next,next2),next,dot(uv.yy,uv.xx));
	//next = fwidth(next);
	//next = fract(next);
	
#elif 0
	
	p = s2c(next);
	sp = s2c(next);
	
	next = last.xyz + whatisoutsideapixel(p,sp,m,uv,t);
	next = fract(next);
	
#elif 0
	
	next = fwidth(next);
	
#endif
	
	//next = whatisoutsideapixel(s2c(next).yx,m.yx,sp.yx,uv,t);
	
	//next *= 1.0-log(next - prev);
	
	gl_FragColor = vec4( next, 1.0 );
	
	
	//gl_FragColor.xyz = vec3(fract(m),dot(m,m));
	
}
