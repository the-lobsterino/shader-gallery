#ifdef GL_ES
precision highp float;
#endif

//old stuff

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 pmouse;

#define hpi       1.5707963
#define pi        3.1415926
#define tau       6.2831853

#define phi       .00001    //distance to surface
#define maxl      64.    //max ray length
#define delta     .01   //normal derivation offset

const int maxi  = 64;
const int maxs  = 12;
const int maxao = 4;

struct view{
	vec3  p;
	vec3  d;
};

struct ray{
    vec3  o;
	vec3  p;
	vec3  d;
	vec3  n;
	vec3  c;
	float l;
};

struct light{
	vec3  p;
	vec3  d;
	vec3  c;
};
	
struct mat{
	float r;
	float i;
	vec3  dc;
	vec3  sc;
};

mat4 rmat4 = mat4(vec4(1., 0., 0., 0.),
		          vec4(0., 1., 0., 0.),
		          vec4(0., 0., 1., 0.),
		          vec4(0., 0., 0., 1.));

mat3 fmat3 = mat3(vec3(1., 0., 0.),
		          vec3(0., 1., 0.),
		          vec3(0., 0., 1.));

float map(vec3 p);
ray   trace(ray r);
vec3  derive3(const in vec3 p);
vec3  derive4(const in vec3 p);

vec3  sphtocar(const in vec3 v);

void rotatef3(const in vec3 r);

mat3  tmat(const in vec3 r);
mat3  rmat( const in vec3 d, const in vec3 z );
    
ray   shade(ray r, view v, light l, mat m);

void  shCgray(out vec4[7] shC);
void  shCsurface(out vec4[7] shC);

float sphere(const in vec3 p, const in float r);
float cube(const in vec3 p, const in vec3  s);
float fractal(in vec3 p, in vec3 c, in vec3 r, const in vec3 a);
vec3  harmonic(vec4[7], vec4 n);

float hash(float v);
float hash(vec2 v);
float hash(vec2 v, float s);
vec3  noise(vec2 v);

void main() {
    vec2 uv     = gl_FragCoord.xy/resolution.xy;
    vec2 p      = (-resolution.xy + 2.0 * gl_FragCoord.xy) / resolution.x;
  
	view v;
	v.d  = normalize(vec3(p.xy, 1.));
    v.p  = vec3(p.x, p.y + 1., -10.);
	
	light l;
    l.p = vec3(11.,32., 0.);
    l.p.y = abs(l.p.y);
    l.c = vec3(.85, .85, .65);

	ray r;
    r.o = v.p;
	r.d = v.d;
    r.p = r.o;

	r = trace(r);

    if(r.l < float(maxl)){
        mat m;
  	    m.r  = .2;//max(0.0001, mouse.x);
	    m.i  = .35;//max(0.0001, mouse.y);
	    m.dc = vec3(.86, .8, .8);
	    m.sc = vec3(.65, .65, .5)+abs(1.-r.p*.025);;
        
        r = shade(r,v,l,m);
        
    }
    gl_FragColor = vec4(r.c*vec3(1.,.5,.5), 0.);
}

ray trace(ray r){
	float l;
 	for(int i = 0; i < maxi; i++){
		l   =  map(r.p);
		r.p += l*r.d;
        r.l += l;
		if (l-phi <= 0. || r.l >= maxl){
            break;
        }
	}
	return r;
}

float map(vec3 p){
    vec2 m = mouse;
 
    vec3 n = noise(p.xz*.075);
    n.y   *= .5;

    vec3 pf0, pf1, cf, af, rf;
    float f0, f1, w, g;
    
    rf = vec3(2. * m, .3);
    rf.x  = tau * rf.x + pi;
	rf.y  = pi  * rf.y + hpi;
	rf.z  = rf.z + 1.5;

    pf0 = p - vec3(-8., 0., 6.);
    pf1 = p - vec3( 8., 0., 6.);
    cf = vec3(1.129, 22., 1.9);
    af = vec3(0.);
    
    f0 = fractal(pf0, cf, rf, af);
    f1 = fractal(pf1, cf, rf, af);

    return min(f0, f1); 
}

ray shade(ray r, view v, light l, mat m){
	r.n        = derive3(r.p);
    
    vec3  rtl  = r.p+l.p;
	float lm   = distance(r.p, l.p);
	float attn = (1./lm)*lm;
    
    l.d        = normalize(rtl);
	    
    float ndl  = max(0.0, dot(r.n, l.d));
	
    r.c = ndl * m.dc;
   
    return r;
}

//tetrahedral normal - tigher resolution
vec3 derive4( const in vec3 p )
{
	float d = delta;

	vec3 d0 = vec3( d, -d, -d);
	vec3 d1 = vec3(-d, -d,  d);
	vec3 d2 = vec3(-d,  d, -d);
	vec3 d3 = vec3( d,  d,  d);

	float f0 = map(p + d0);
	float f1 = map(p + d1);
	float f2 = map(p + d2);
	float f3 = map(p + d3);

	return normalize(d0*f0+d1*f1+d2*f2+d3*f3);
}

vec3 derive3(const in vec3 p){
	vec3 e = vec3(delta, 0., 0.);
	vec3 d = vec3(
		map(p+e.xyy)-map(p-e.xyy),
		map(p+e.yxy)-map(p-e.yxy),
		map(p+e.yyx)-map(p-e.yyx)
	);
	return normalize(d);
}

vec3 sphtocar(const in vec3 s){
    vec3 v;
    float a = s.x * cos(s.z);
    v.x = a * cos(s.y);
    v.y = s.x * sin(s.z);
    v.z = a * sin(s.y);
    return v;
}

vec3 harmonic(vec4[7] c, vec4 n){ 	
	vec3 l1;
	vec3 l2;
	vec3 l3;

	l1.r = dot(c[0],n);
	l1.g = dot(c[1],n);
	l1.b = dot(c[2],n);
	
	vec4 m2 = n.xyzz * n.yzzx;
	l2.r = dot(c[3],m2);
	l2.g = dot(c[4],m2);
	l2.b = dot(c[5],m2);
	
	float m3 = n.x*n.x - n.y*n.y;
	l3 = c[6].xyz * m3;
    	
	vec3 sh = vec3(l1 + l2 + l3);
	
	return clamp(sh, 0.0, 1.);
}

float sphere(const in vec3 p, const in float r){
	return length(p)-r;
}

float cube(const in vec3 p, const in vec3 s )
{
	vec3 d = (abs(p) - s);
	return max(d.x, max(d.y, d.z));
}

float hash( float v )
{
    return fract(sin(v)*43758.5453123);
}

float hash(vec2 v)
{
	return fract(sin(dot(v.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float hash(vec2 p, float v){
	return fract(956.9*cos(429.9*dot(vec3(p,v),vec3(9.7,7.5,11.3))));
}

//iq's derivative noise
vec3 noise( in vec2 x )
{
    vec2 p = floor(x);
    vec2 f = fract(x);
    vec2 u = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    float a = hash(n+  0.0);
    float b = hash(n+  1.0);
    float c = hash(n+ 57.0);
    float d = hash(n+ 58.0);
	return vec3(a+(b-a)*u.x+(c-a)*u.y+(a-b-c+d)*u.x*u.y,30.0*f*f*(f*(f-2.0)+1.0)*(vec2(b-a,c-a)+(a-b-c+d)*u.yx));
}

float fractal(in vec3 p, in vec3 c, in vec3 r, const in vec3 a){
	rotatef3(r);
	fmat3 *= c.x;
			 
	for (int i = 0; i < 64; i++) {
   	    p   *= fmat3;
		p    = abs(p+a)-c.x;
        c.z *= c.x;
    }
	return (length(p)-c.y)/c.z;
}

void rotatef3(const in vec3 r){
	vec3 axis0 = vec3(cos(r.x)*cos(r.y),sin(r.y),sin(r.x)*cos(r.y));
	
	float c0 = cos(r.z);
	float s0 = sin(r.z);
    
	vec3 as = axis0*s0;
	vec3 ac = axis0*axis0*(1.-c0);
	vec3 ad = axis0.yzx*axis0.zxy*(1.-c0);
    
	fmat3 = mat3( c0   + ac.x , ad.z - as.z , ad.y + as.y,
		          ad.z + as.z , c0   + ac.y , ad.x - as.x,
		          ad.y - as.y , ad.x + as.x , c0   + ac.z);

}

mat3 rmat3(const in vec3 d, const in vec3 z)
{
    vec3  v = cross( z, d );
    float c = dot( z, d );
    float k = (1. - c)/(1.-c*c);

    return mat3( v.x*v.x*k + c,   v.y*v.x*k - v.z, v.z*v.x*k + v.y,
                 v.x*v.y*k + v.z, v.y*v.y*k + c,   v.z*v.y*k - v.x,
                 v.x*v.z*k - v.y, v.y*v.z*k + v.x, v.z*v.z*k + c);
}


void rotate4(float angle, float d1, float d2, float d3, float d4)
{
	float c = cos(angle), s = sin(angle);
	rmat4 *= mat4(vec4( c*d1+(1.-d1),      s*d2*d1,     -s*d3*d1,      s*d4*d1 ),
		          vec4(     -s*d1*d2, c*d2+(1.-d2),      s*d3*d2,     -s*d4*d2 ),
		          vec4(      s*d1*d3,     -s*d2*d3, c*d3+(1.-d3),      s*d4*d3 ),
		          vec4(     -s*d1*d4,      s*d2*d4,     -s*d3*d4, c*d4+(1.-d4) ));
}

void shCsurface(out vec4[7] shC){
    float t0 = 2. * sin(time * 3.)+1.;
    float t1 = 2. * sin(time * 4.)+1.;
   
    shC[0] = t0 * vec4(0.4, 0.4, -0.4, 0.0);
    shC[1] = t1 * vec4(0.0, -0.2, -0.3, 0.0);
    shC[2] = t0 * vec4(0.3, 0.3, 0.1, 0.0);
    shC[3] = t1 * vec4(0.0, 0.0, 0.5, 0.0);
    shC[4] = t0 * vec4(0.5, -0.2, 0.4, 0.0);
    shC[5] = t1 * vec4(-0.4, 0.1, 0.1, 0.0);
    shC[6] = t0 * vec4(0.1, 0.5, 0.3, 0.0);
}

void shCgray(out vec4[7] shC){
    shC[0] = vec4(0.0, 0.0, 0.0, 0.25);
    shC[1] = vec4(0.0, 0.0, 0.0, 0.25);
    shC[2] = vec4(0.0, 0.0, 0.0, 0.25);
    shC[3] = vec4(0.0, 0.0, 0.0, 0.0);
    shC[4] = vec4(0.0, 0.0, 0.0, 0.0);
    shC[5] = vec4(0.0, 0.0, 0.0, 0.0);
    shC[6] = vec4(0.0, 0.0, 0.0, 0.0);
}
