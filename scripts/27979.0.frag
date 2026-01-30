#ifdef GL_ES
precision mediump float; 
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;


//PID Controller Snake
//Each link chases the next.
//https://en.wikipedia.org/wiki/PID_controller

//This is a function approximation algorithim - in this case the function is your mouse input
//The first red link tries to guess where your mouse will go, and the others are chasing one another.

//Over mutiple frames, proportions of error, integral and derivative are mixed 
//and the result is used to smooth or tighten the estimate.

//For controlling systems, have these variables tweak themselves - I've yet to write that.


//Warning : too many segments will kill performance in this implementation.
#define SEGMENTS 8

//Changing tilesize may help or hinder performance (or not.)
#define TILESIZE 32.

//Don't mess with these
#define READS (SEGMENTS * 2)
#define WRITES (SEGMENTS * 2 + 1)

//PID Parameters - messing with these will change the behaviour of the trail.
#define ERROR .75
#define INTEGRAL 1.
#define DERIVATIVE .015
#define RATE 1./4.


//t - target value | v - current value | e - error | i - integral | d - derivative
struct controller2d{
	vec2 t, v, e, i, d;
};
	
void 	pid(inout controller2d c);

vec2	screen_aspect(vec2 p);
float	line(vec2 p, vec2 a, vec2 b, float w);
vec3	hsv(float h,float s,float v);

void	read(out vec4[READS] m);
void	write(const in vec4[WRITES] w);
vec4	compact(vec4 v);
vec4	expand(vec4 v);

void main( void ) {
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec4 rb = texture2D(renderbuffer, uv);
	vec2 p	= screen_aspect(uv);
	
	vec4 m[READS];
	read(m);		
	
	controller2d c[SEGMENTS];
	
	vec3 l = vec3(0.);
	vec2 lv = vec2(0.);
	for(int i = 0; i < SEGMENTS; i++)
	{
		vec4 mx	= expand(m[i]);
		vec4 my	= expand(m[SEGMENTS+i]);
		
		//load struct with information from last frames memory
		//the target "t" is either the mouse for the first link target, or the next link ahead
		c[i].t	= i > 0 ? lv : mouse;
		c[i].v 	= vec2(mx.x, my.x);
		c[i].e 	= vec2(mx.y, my.y);
		c[i].i 	= vec2(mx.z, my.z);
		c[i].d 	= vec2(mx.w, my.w);
	
		pid(c[i]);
	
		//mix returned values to create the chase position
		c[i].v 	= c[i].v - c[i].e - c[i].d * .125;
		
		lv 	= c[i].v;
		
		vec2 a  = screen_aspect(c[i].v);
		vec2 b  = screen_aspect(c[i].t);
		l 	= max(l, hsv(float(i)*.1, 1., 1.) * line(p, a, b, .005));
	}
	
	vec4 r 	= vec4(l, 1.);
	
	//write out structs
	vec4 w[WRITES];
    	w[WRITES-1]	= r;
	for(int i = 0; i < SEGMENTS; i++)
	{
		w[i]		= compact(vec4(c[i].v.x, c[i].e.x, c[i].i.x, c[i].d.x));	
		w[SEGMENTS+i]	= compact(vec4(c[i].v.y, c[i].e.y, c[i].i.y, c[i].d.y));
	}
	write(w);
    
}//sphinx

//pid controller 
void pid(inout controller2d c)
{
	vec2 error 	= c.t - c.v;
	vec2 integral	= c.i + error * RATE;
	vec2 delta	= error - c.e;

	c.v = ERROR * error + INTEGRAL * integral + DERIVATIVE * delta;
	c.e = error;
	c.i = integral;
	c.d = delta;
}


//draws a line
float line(vec2 p, vec2 a, vec2 b, float w){
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
    	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	return smoothstep(w, 0., l.x+l.y);
}

//adjusts for aspect ratio
vec2 screen_aspect(vec2 p){
	p.x *= resolution.x/resolution.y;
	return p;
}

//hue saturation value color space
vec3 hsv(float h,float s,float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

//expand value in 0.,-1. range to -1, 1.
vec4 expand(vec4 v)
{
	return (v*2.)-1.;	
}
	
//compact value from -1., 1. range to 0., 1.
vec4 compact(vec4 v)
{	
	v = clamp(v, -1., 1.);
	return (v + 1.)*.5;
}

//read from memory stored in blocks on the bottom left of the screen
void read(out vec4[READS] m)
{
	float px = 1./resolution.x;
	vec2 b = vec2(0., 0.);
	float t = 0.;
	float f = 0.;
	float h = 0.;
	float j = 0.;
	for(int i = 0; i < READS; i++)
	{
		j = float(i);
		t = floor(float(i)/TILESIZE);
		f = floor(float(i));
		h = floor(float(i)*.5)*2.;
		b.x = mod(f,2.)+h-t*TILESIZE;
		b.y = mod(b.x,2.)+t*2.;
		m[i] = texture2D(renderbuffer, (vec2(b.x, b.y)+1.)/resolution);
	}	
}


//write to memory stored in blocks on the bottom left of the screen
void write(const in vec4[WRITES] w)
{
	vec4 m 	= w[WRITES-1];
	vec2 b = vec2(0., 0.);
	vec2 fc = floor(gl_FragCoord.xy);
	float t = 0.;
	float f = 0.;
	float h = 0.;
	float j = 0.;
	if(gl_FragCoord.x<float(WRITES-1))
	{
		for(int i = 0; i < WRITES; i++)
		{
			j = float(i);
			t = floor(j/TILESIZE);
			f = floor(j);
			h = floor(j*.5)*2.;
			b.x = mod(f,2.)+h-t*TILESIZE;
			b.y = mod(b.x,2.)+t*2.;
			m = fc.x == b.x && fc.y == b.y ? w[i] : m;
		}
	}
	gl_FragColor = m;
}
