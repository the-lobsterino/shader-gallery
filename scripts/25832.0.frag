#ifdef GL_ES
precision mediump float;
#endif

//investigation of noise function from http://glslsandbox.com/e#24353.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float 	fold(in float x);
vec3 	fold(in vec3 p);
float 	fold_harmonic(in vec3 p, const int it);
float 	ifs(in float a, in float f, in vec3 p, const int it, const int itf);
vec2 	format(in vec2 uv);
vec3 	hsv(in float h, in float s, in float v);
mat3 	rmat(in vec3 r);

void main( void ) {
	//screen coordinates
	vec2 uv 	= gl_FragCoord.xy / resolution.xy;
	uv 		= format(uv);

	
	//create 3d position
	float t 	= 2./(sqrt(2.));
	vec3 p 		= vec3((t*uv.x-uv.y), -(t*uv.x+uv.y), uv.y*2.); //mercedes benz basis
	p 		*= .125 + sin(time) + 1.;
	
	
	//simulate a little convection
	//p 		*= rmat(vec3(0., 0., time * .05)-abs(p-fract(abs(p)*2.)*.75));
	
	//fractal
	float noise 	= ifs(.25, 2.5, p, 3, 2);
	//noise 		= fold_harmonic(p*2., 1);
	
	
	//surface threshold
	float manifold	= length(uv);
	manifold 	= mix(noise * 2. * manifold * .125, manifold - .75, .5);
	manifold 	= step(manifold, .125)+.1;
	
	
	//hsv color plot
	vec3 plot 	= hsv(fract(noise/(cos(time) + 1.)),1.,1.);

	
	
	gl_FragColor 	= vec4(plot * manifold, 1.);
}//sphinx

float fold(in float x)
{
	return abs(fract(x)-.5);
}


vec3 fold(in vec3 p)
{
	float x = fold(p.x);
	return vec3(fold(p.z+fold(p.y)), fold(p.z+x), fold(p.y+x));
}


float fold_harmonic(in vec3 p, const int it)
{
	
	vec3 bp = abs(p);

	float rz = 1.;
	for (int i = 0; i < 32; i++)
	{
		if(i>it) break;
		p 	*= fold(bp);
		bp 	+= abs(fract(bp))-rz;
		rz	+= dot(fold(p), bp)-rz;

	}
	return rz*float(it);
}


float ifs(in float a, in float f, in vec3 p, const int it, const int itf)
{
	float n = 0.;
	for(int i = 0; i < 32; i++)
	{
		if(i>it) break;
		
		n 	= fract(n);
		n 	+= fold_harmonic(p*f, itf)*a;
		a 	*= .85;
		f 	*= 1.125;
	}

	return n;
}

vec2 format(in vec2 uv)
{
	uv 	= uv * 2. - 1.;
	uv.x 	*= resolution.x/resolution.y;
	return uv;
}


vec3 hsv(in float h, in float s, in float v){
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

mat3 rmat(in vec3 r)
{
	vec3 a = vec3(cos(r.x)*cos(r.y),sin(r.y),sin(r.x)*cos(r.y));
	
	float c = cos(r.z);
	float s = sin(r.z);
	vec3 as  = a*s;
	vec3 ac  = a*a*(1.1- c);
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