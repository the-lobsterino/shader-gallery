#ifdef GL_ES
precision highp float; 
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

#define segments 12
#define reads (segments * 2)
#define writes (segments * 2 + 1)
#define tilesize 32.

#define COLLISION 

//proportional–integral–derivative controller 
//https://en.wikipedia.org/wiki/PID_controller


//2d pid struct - target, position, error, integral, derivative

//collision isnt working - booo!

struct controller2d
{
	vec2 t, p, e, i, d;
};
	

float 	contour(float field, float scale);
float 	line(vec2 position, vec2 a, vec2 b, float scale);
float	circle(vec2 position, float radius, float scale);
vec2	toworld(vec2 p);
vec3	hsv(float h,float s,float v);

void	read(out vec4[reads] m);
vec4	write(const in vec4[writes] w);
vec4	compact(vec4 v);
vec4	expand(vec4 v);


//weights
#define K_error 	-.3   
#define K_integral 	.4
#define K_derivative 	-.2
#define K_frame 	.175;

//smooth        : .0625, .5, .15, .5	
//whiplike       : -.5, 1.5, -.35, .125	
//fake particles : -.5, .05, .135, .5	

void pid(inout controller2d c)
{	
	vec2 error 	= c.t - c.p;
	vec2 integral	= c.i + error * K_frame;
	vec2 derivative	= c.e - error;
	
	c.e = error;					
	c.i = integral;					
	c.d = derivative;				
	c.p = K_error * error 
	    + K_integral * integral 
	    + K_derivative * derivative;
}


vec2 derivative(vec2 p, vec2 v)
{
	vec2 epsilon 	= vec2( .001, 0.);
	vec2 gradient 	= vec2(   0., 0.); 
	p 		-= v;
	gradient.x	= length(p - epsilon.xy) - length(p + epsilon.xy);
	gradient.y	= length(p - epsilon.yx) - length(p + epsilon.yx);
	return gradient;
}


vec3 buffer_derivative(vec2 uv)
{
	vec2 epsilon 	= vec2( .0125, 0.);
	vec3 gradient 	= vec3( 0., 0., 0.); 
	gradient.x	= texture2D(renderbuffer, uv - epsilon.xy).w - texture2D(renderbuffer, uv + epsilon.xy).w;
	gradient.y	= texture2D(renderbuffer, uv - epsilon.yx).w - texture2D(renderbuffer, uv + epsilon.yx).w;
	gradient.z	= length(gradient.xy);
	return gradient;
}



void main( void ) 
{
	vec2 uv = gl_FragCoord.xy/resolution.xy;
	vec2 a 	= resolution.yx/min(resolution.x, resolution.y);
	vec2 p	= toworld(uv);
	vec2 t	= toworld(mouse);
	
	vec4 m[reads];
	read(m);		
	
	controller2d c[segments];

	float wt 	= 1.;
	float r		= .00625;
	vec3 l 		= vec3(1., 0., 0.) * circle(p-t, r, wt);
	vec2 pp 	= vec2(0.);
	
	#ifdef COLLISION
	vec3 gradient	= normalize(buffer_derivative(uv));
	vec2 normal	= normalize(gradient.xy);
	vec3 map	= vec3(999.);
	#endif
	
	for(int i = 0; i < segments; i++)
	{
		vec4 mx	= expand(m[i]);
		vec4 my	= expand(m[segments+i]);		
		c[i].p 	= vec2(mx.x, my.x)/a;
		c[i].e 	= vec2(mx.y, my.y);
		c[i].i 	= vec2(mx.z, my.z);
		c[i].d 	= vec2(mx.w, my.w);
			
		c[i].t	= i == 0 ? t : pp;
		
		
		vec2 d	= normalize(c[i].p - c[i].t) * r;
		
		pid(c[i]);		
	
		
		l 	+= hsv(float(i)/float(segments) * .75, 1., 1.) * line(p, c[i].p-d, c[i].t+d, wt);
		l 	+= hsv(float(i)/float(segments) * .75, 1., 1.) * circle(p - c[i].p, r, wt);
		
	
		#ifdef COLLISION
		float f 	= length(p - c[i].p);			
		vec2 gradient	= derivative(p, c[i].p);
		vec2 normal	= normalize(gradient.xy);	
		map		= f > r && f < map.z ? vec3(normal, f) : map;
		#endif
		
		pp 		= c[i].p;	
	}
		
	for(int i = 0; i < segments; i++)
	{		
		#ifdef COLLISION
		c[i].p = gradient.z < map.z && map.z > r ? c[i].p - normal * .01 * map.z : c[i].p;	
		#endif
	}
	
	
	
	if(gl_FragCoord.x<float(writes-1) && gl_FragCoord.y<float(writes-1))
	{
		
		vec4 w[writes];
    		w[writes-1]	= vec4(l * 2., 1.);
		for(int i = 0; i < segments; i++)
		{		
			c[i].p		*= a;
			w[i]		= compact(vec4(c[i].p.x, c[i].e.x, c[i].i.x, c[i].d.x));	
			w[segments+i]	= compact(vec4(c[i].p.y, c[i].e.y, c[i].i.y, c[i].d.y));
		}
		
		gl_FragColor = write(w);
		return;
	}
	else
	{	
		vec4 result	= vec4(l * 2., 1.);

		#ifdef COLLISION
		result		+= vec4(map.xyz, map.z);;
		#endif	
			
   		gl_FragColor 	= result;
	}
}//sphinx



float contour(float field, float scale)
{
	return 1. - clamp(field * min(resolution.x, resolution.y)/scale, 0., 1.);
}


float line(vec2 position, vec2 a, vec2 b, float scale)
{
	b = 	   b - a;
	a = position - a;
	return contour(distance(a, b * clamp(dot(a, b) / dot(b, b), 0., 1.)), scale);
}

float circle(vec2 position, float radius, float scale)
{
	return contour(abs(length(position)-radius), scale);
}


vec2 toworld(vec2 p)
{
	p -= .5;
	p *= resolution/max(resolution.x, resolution.y);
	return p;
}

vec3 hsv(float h,float s,float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


vec4 expand(vec4 v)
{	
	return vec4(v * 2. - 1.);	
}
	
vec4 compact(vec4 v)
{	
	return vec4(v * .5 + .5);
}

void read(out vec4[reads] m)
{
	float px = .5/resolution.x;
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
		m[i] = texture2D(renderbuffer, (vec2(b.x, b.y))/resolution+px);
	}	
}

vec4 write(const in vec4[writes] w)
{
	vec4 m 	= w[writes-1];
	vec2 b  = vec2(0., 0.);
	vec2 fc = floor(gl_FragCoord.xy);
	float t = 0.;
	float f = 0.;
	float h = 0.;
	float j = 0.;

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
	
	return m;
}
