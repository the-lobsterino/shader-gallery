#ifdef GL_ES
precision mediump float;
#endif

uniform float 		time;
uniform vec2 		mouse;
uniform vec2 		resolution;
uniform sampler2D 	renderbuffer;

//materia harmonic
//sphinx

#define timescale 4096.
#define aspect (resolution.x/resolution.y)
#define boundary gl_FragCoord.x <= 1. || gl_FragCoord.y <= 1. || gl_FragCoord.x >= resolution.x-1. || gl_FragCoord.y >= resolution.y-1.

vec4 	pid(float p, float t, float e, float i);
float	line(vec2 p, vec2 a, vec2 b, float w);
float	hash(float v);
float	noise(in vec2 v);
vec2	toworld(vec2 p);

void	samplecross(vec2 uv, out vec4[5] s);
void	sampleneumann(vec2 uv, out vec4[5] s);

void main( void ) {
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 p 		= toworld(uv);
	vec2 m 		= toworld(uv-mouse+.5);
	
	//sample
	vec4 s[5];
	float ft	= (32768. + time) * timescale;
	bool even 	= fract(gl_FragCoord.x + ft) <= .5 && fract(-gl_FragCoord.y + ft) <= .5;
	if(even)
	{
		sampleneumann(uv, s);
	}
	else
	{
		samplecross(uv, s);
	}
	
	
	for(int i = 0; i < 5; i++)
	{
		s[2] = mix(s[2], max(s[2], s[4-i]), .5);	
	}
	
	float v = max(1., (s[0].w+s[1].w+s[2].w+s[3].w+s[4].w))/4.25;
	
	//pid control - left right top bottom
	vec4 c[4]; 
	c[0] = pid(s[1].x * 2. - .5, v, s[1].z, s[1].w); 
	c[1] = pid(s[3].x * 2. - .5, v, s[3].z, s[3].w); 
	c[2] = pid(s[0].y * 2. - .5, v, s[0].z, s[0].w); 
	c[3] = pid(s[4].y * 2. - .5, v, s[4].z, s[4].w); 

	vec3 ex		= max(c[0].yzw, c[1].yzw);
	vec3 ey		= max(c[2].yzw, c[3].yzw);
	vec2 e		= mix(ex.yz, ey.yz, clamp(vec2(ex.x, ey.x), 0., 1.));
	e 		= (e + .5) * .5;
	
	float dx	= max(c[0].x, c[1].x);
	float dy	= max(c[2].x, c[3].x);
	vec2 d		= (vec2(dy, dx)) * .023;
	
	//result
	vec4 r		= vec4(d, e);
	r 		= mix(s[2], r, .25 - abs(r.x-r.y) * .75);
	r 		= mix(s[2], r, .5);
	
	//reset button - bottom left
	r 		= mouse.x < .01 && mouse.y     < .01 ? vec4(0.5) : r;
	r 		= uv.x 	  < .01 && uv.y/aspect < .01 ? vec4(1.-v, v, 0., 0.)  : r;

	//cursor
	float mc 	= step(length(m), .05);
	r.zw 		+= mc;

	gl_FragColor	= r.yxzw;
}//sphinx

#define kp 25.
#define ki 127.
#define kd 128.

vec4 pid(float p, float t, float e, float i){
	float error 	= t - p;
	float integral	= i - error;
	float delta	= error - e;
	
	float result 	= kp*error + ki*integral + kd*delta;
	return vec4(result, error, integral, delta);
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

float hash(float v)
{
    return fract(sin(v)*43758.5453123);
}

float noise(in vec2 v)
{
    vec2 p = floor(v);
    vec2 f = fract(v);
    f = f*f*(3.0-2.0*f);
    float n = p.x + p.y*57.0;
    p.x = mix(hash(n+ 0.), hash(n+  1.), f.x);
    p.y = mix(hash(n+57.), hash(n+ 58.), f.x);
    float res = mix(p.x, p.y, f.y);
    return res;
}

vec2 toworld(vec2 p){
	p = p * 2. - 1.;
	p.x *= aspect;
	return p;
}

void sampleneumann(vec2 uv, out vec4[5] s){
	//bottom, left, center, right, top
	vec2 p  = 1./resolution.xy;
	vec3 o	= vec3(-1., 0., 1.);
	uv	= boundary ? 1.-uv : uv;
	s[0]	= texture2D(renderbuffer, uv + p * o.yx);
	s[1]	= texture2D(renderbuffer, uv + p * o.xy);
	s[2]	= texture2D(renderbuffer, uv);
	s[3]	= texture2D(renderbuffer, uv + p * o.zy);
	s[4]	= texture2D(renderbuffer, uv + p * o.yz);
}

void samplecross(vec2 uv, out vec4[5] s){
	//bottom left, top right, center, top left, bottom right
	vec2 p  = 1./resolution.xy;
	vec3 o	= vec3(-1., 0., 1.);
	uv	= boundary ? 1.-uv : uv;
	s[0]	= texture2D(renderbuffer, uv + p * o.zz);
	s[1]	= texture2D(renderbuffer, uv + p * o.zx);
	s[2]	= texture2D(renderbuffer, uv);
	s[3]	= texture2D(renderbuffer, uv + p * o.xz);
	s[4]	= texture2D(renderbuffer, uv + p * o.xx);
}
