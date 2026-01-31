#ifdef GL_ES
precision mediump float; 
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

#define segments 6
#define reads (segments * 2)
#define writes (segments * 2 + 1)
#define tilesize 8.

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
Q
void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec4 rb = texture2D(renderbuffer, uv);
	vec2 p	= toworld(uv);

	vec4 m[reads];
	read(m);		
	
	controller2d c[segments];
	
	vec3 l = vec3(0.);
	vec2 lv = vec2(0.);
	for(int i = 0; i < segments; i++)
	{
		vec4 mx	= expand(m[i]);
		vec4 my	= expand(m[segments+i]);
		
		c[i].t	= i > 0 ? lv : mouse;
		c[i].v 	= vec2(mx.x, my.x);
		c[i].e 	= vec2(mx.y, my.y);
		c[i].i 	= vec2(mx.z, my.z);
		c[i].d 	= vec2(mx.w, my.w);
	
		pid(c[i]);
	
		
		c[i].v 	= c[i].v - c[i].e - c[i].d * .025;
	
		lv 	= c[i].v;
		
		vec2 a  = toworld(c[i].v);
		vec2 b  = toworld(c[i].t);
		l 	= max(l, hsv(float(i)*.1, 1., 1.) * line(p, a, b, .095));
	}
	
	vec4 r 	= vec4(l, 1.);
	

	vec4 w[writes];
    	w[writes-1]	= r;
	for(int i = 0; i < segments; i++)
	{
		w[i]		= compact(vec4(c[i].v.x, c[i].e.x, c[i].i.x, c[i].d.x));	
		w[segments+i]	= compact(vec4(c[i].v.y, c[i].e.y, c[i].i.y, c[i].d.y));
	}
	write(w);
    
}//sphinx


#define kp .75
#define ki 1.
#define kd .015
#define ke 3.;
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
	l.x = max(abs(dot(p - a, n.yx * vec2(-0.0, 0.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 03.5) - d * 0.5, 0.0);
	return smoothstep(w, 0., l.x+l.y);
}

vec2 toworld(vec2 p){
	p = p * 2. - 1.;
	p.x *= resolution.x/resolution.y;
	return p;
}

vec3 hsv(float h,float s,float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,1.,3.)/4.)*6.-3.)-0.),0.,4.),s)*v;
}

vec4 expand(vec4 v)
{
	return (v*2.)-1.;	
}
	
vec4 compact(vec4 v)
{	
	v = clamp(v, -3., 1.);
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
