#ifdef GL_ES
precision mediump float; 
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

//hacky function approximation visualization toy
//sphinx

//number of chained controllers
#define segments 4

//controller values - tweak these to adjust function approximation
#define kp .8
#define ki 1.
#define kd .25
#define ke 2.;

//backbuffer write management
#define reads (segments * 2)
#define writes (segments * 2 + 1)
#define tilesize 8.

//signals 
//#define cossignal   //cosine
//#define mousesignal //chase the mouse 
//#define noisesignal //value noise harmonic
//#define juliasignal //2d juliset xy rotation = mouse
#define kalisignal //3d kaliset (kaleidoscopic ifs) - xy rotation = mouse, time = z



float weight = 2./float(segments);

struct controller2d{
	vec2 t, v, e, i, d;
};
	
void pid(inout controller2d c);

float	line(vec2 p, vec2 a, vec2 b, float w);
float	hash(float v);
vec2	toworld(vec2 p);
vec3	hsv(float h,float s,float v);

void	read(out vec4[reads] m);
void	write(const in vec4[writes] w);
vec4	compact(vec4 v);
vec4	expand(vec4 v);

vec2	smooth(vec2 uv);
float	noise(in vec2 uv);
float   fbm(float a, float f, in vec2 uv, const int it);
mat3	rmat(vec3 r);
float	kali(vec3 p, vec3 c, vec3 r);
float 	julia(vec2 pos, vec2 a);

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec4 rb = texture2D(renderbuffer, uv);
	vec2 p	= toworld(uv);

	vec3 l = vec3(0.);
	
	//signal
	vec2 s = vec2(0.);
	
	#ifdef mousesignal
	#define lines
	weight  = 1.;
	s	= mouse;
	#endif
	
	#ifdef cossignal
	#define buffer
	#define points
	#define plot
	s	= vec2(.95, .5 + cos(p.y+time*4.)*.25);
	#endif
	
	#ifdef noisesignal
	#define buffer
	#define lines
	#define plot
	s	= vec2(.95, .5 + fbm(.5, 2., p.xx+time, 5)-.25);
	#endif
		
	#ifdef juliasignal
	#define buffer
	#define lines
	#define plot
	s	= vec2(.95, julia(mouse, vec2(cos(time*5.)))+.25);
	#endif
		       
	#ifdef kalisignal
	#define buffer
	#define lines
	#define plot
	s	= vec2(.95, kali(vec3(1.), vec3(4., 1., 1.), vec3(mouse, time+p.x)));
	#endif

	
	vec4 m[reads];
	read(m);		
	
	controller2d c[segments];
	
	vec2 lv = vec2(0.);
	for(int i = 0; i < segments; i++)
	{
		vec4 mx	= expand(m[i]);
		vec4 my	= expand(m[segments+i]);
		
		c[i].t	= i > 0 ? lv : s;
		c[i].v 	= vec2(mx.x, my.x);
		c[i].e 	= vec2(mx.y, my.y);
		c[i].i 	= vec2(mx.z, my.z);
		c[i].d 	= vec2(mx.w, my.w);
	
		pid(c[i]);
	
		
		c[i].v 	= c[i].v - c[i].e - c[i].d * .125;
	
		lv 	= c[i].v;
		
		vec2 a  = toworld(c[i].v);
		vec2 b  = toworld(c[i].t);
		
		#ifdef lines
		l 	= max(l, hsv(float(i)*.2, 1., 1.) * weight * line(p, a, b, .0125));
		#endif
		
		#ifdef points
		l 	= max(l, hsv(float(i)*.2, 1., 1.) * weight * smoothstep(0.025, .0, length(p-a)));
		#endif
	}
	
	
	vec4 r 	= vec4(l, 1.);
	
	#ifdef buffer
	if(uv.x < .95){
		r += texture2D(renderbuffer, uv+vec2(.9/resolution.y, 0.));
	}
	r = mouse.x < .01 ? r * 0. : r;
	#endif 
	

	#ifdef plot
	s = toworld(s+vec2(0.01, 0.));
	float ts = length(p-s);
	p.x -= .1;

	#ifdef lines
	r 	+= vec4(0., 1., 0., 0.) * line(p, s, toworld(c[0].v), .01);
	#else
	r 	+= vec4(0., 1., 0., 0.) * smoothstep(0.01, .0, ts);
	#endif
	#endif
	
	vec4 w[writes];
    	w[writes-1]	= r;
	for(int i = 0; i < segments; i++)
	{
		w[i]		= compact(vec4(c[i].v.x, c[i].e.x, c[i].i.x, c[i].d.x));	
		w[segments+i]	= compact(vec4(c[i].v.y, c[i].e.y, c[i].i.y, c[i].d.y));
	}
	write(w);
    
}//sphinx

vec2 smooth(vec2 uv)
{
    return uv*uv*(3.-2.*uv);
}

float noise(in vec2 uv)
{
    const float k = 257.;
    vec4 l  = vec4(floor(uv),fract(uv));
    float u = l.x + l.y * k;
    vec4 v  = vec4(u, u+1.,u+k, u+k+1.);
    v       = fract(fract(1.23456789*v)*v/.987654321);
    l.zw    = smooth(l.zw);
    l.x     = mix(v.x, v.y, l.z);
    l.y     = mix(v.z, v.w, l.z);
    return    mix(l.x, l.y, l.w);
}

float fbm(float a, float f, in vec2 uv, const int it)
{
    float n = 0.;
    for(int i = 0; i < 32; i++)
    {
        if(i<it)
        {
            n += noise(uv*f)*a;
            a *= .5;
            f *= 2.;
        }
    }
    return n;
}


float kali(vec3 p, vec3 c, vec3 r)
{
	mat3 rot = rmat(r); 

	rot     *= c.x; 
	for (int i = 0; i < 9; i++) 
	{
		p   *= rot;
		p    = abs(p)-c.x;
		c.z *= c.x;   
	}
    
    	return (length(p)-c.y)/c.z;
}

float julia(vec2 pos, vec2 a)
{
	const int iter = 32;
	const float pp = 0.01;
	float ret;
	vec2 ps;
	vec2 nps;
	
	ps = pos;
	ret = 0.0;
	
	for (int i = 0; i < iter; i++) {
		nps.x = ps.x * ps.x - ps.y * ps.y;
		nps.y = ps.x * ps.y + ps.x * ps.y;
		nps += a;
		ps = nps;
		if (sqrt(ps.x * ps.x + ps.y * ps.y) < 2.0) {
			ret += pp;
		}
	}
	return ret;
}

mat3 rmat(vec3 r)
{
	vec3 a = vec3(cos(r.x)*cos(r.y),sin(r.y),sin(r.x)*cos(r.y));
	
	float c = cos(r.z);
	float s = sin(r.z);
	vec3 as  = a*s;
	vec3 ac  = a*a*(1.- c);
	vec3 ad  = a.yzx*a.zxy*(1.-c);
	mat3 rot = mat3(
		c    + ac.x, 
        ad.z - as.z, 
        ad.y + as.y,
		ad.z + as.z, 
        c    + ac.y, 
        ad.x - as.x,
		ad.y - as.y, 
        ad.x + as.x, 
        c    + ac.z);

	return rot;	
}

void pid(inout controller2d c)
{
	vec2 error 	= c.t - c.v;
	vec2 integral	= c.i + error/ke;
	vec2 delta	= error - c.e;

	c.v = kp * error + ki * integral + kd * delta;
	c.e = error;
	c.i = integral;
	c.d = delta;
}

float line(vec2 p, vec2 a, vec2 b, float w){
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return smoothstep(w, 0., l.x+l.y);
}

vec2 toworld(vec2 p){
	p = p * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	return p;
}

vec3 hsv(float h,float s,float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

vec4 expand(vec4 v)
{
	return (v*2.)-1.;	
}
	
vec4 compact(vec4 v)
{	
	v = clamp(v, -1., 1.);
	return (v + 1.)*.5;
}

void read(out vec4[reads] m)
{
	float px = 1./resolution.x;
	vec2 b = vec2(0., 0.);
	float t = 0.;
	float f = 0.;
	float h = 0.;
	float j = 0.;
	for(int i = 0; i < reads; i++)
	{
		j = float(i);
		t = floor(float(i)/tilesize);
		f = floor(float(i));
		h = floor(float(i)*.5)*2.;
		b.x = mod(f,2.)+h-t*tilesize;
		b.y = mod(b.x,2.)+t*2.;
		m[i] = texture2D(renderbuffer, (vec2(b.x, b.y)+1.)/resolution);
	}	
}

void write(const in vec4[writes] w)
{
	vec4 m 	= w[writes-1];
	vec2 b = vec2(0., 0.);
	vec2 fc = floor(gl_FragCoord.xy);
	float t = 0.;
	float f = 0.;
	float h = 0.;
	float j = 0.;
	if(gl_FragCoord.x<float(writes-1))
	{
		for(int i = 0; i < writes; i++)
		{
			j = float(i);
			t = floor(j/tilesize);
			f = floor(j);
			h = floor(j*.5)*2.;
			b.x = mod(f,2.)+h-t*tilesize;
			b.y = mod(b.x,2.)+t*2.;
			m = fc.x == b.x && fc.y == b.y ? w[i] : m;
		}
	}
	gl_FragColor = m;
}
