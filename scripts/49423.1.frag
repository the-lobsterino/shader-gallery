#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//wip


#define PHI 		((sqrt(5.)+1.)*.5)
#define PHI2 		(PHI*PHI)
#define PHI3 		(PHI*PHI*PHI)
#define TAU 		(8.*atan(1.))

#define VIEW_TARGET 	vec3(0., 0., 0.)
#define TARGET_RANGE	27.
#define VIEW_ORBIT 	(normalize(vec3(sin((mouse.x-.5)*TAU), atan((mouse.y-.5) * TAU)*2., -cos((mouse.x-.5)*TAU+TAU*.5))) * -TARGET_RANGE) //orbit cam
#define VIEW_X 		(normalize(vec3(1., .0001,     0.)) * TARGET_RANGE)
#define VIEW_Y 		(normalize(vec3(.000, 1., -.001)) * TARGET_RANGE)
#define VIEW_Z 		(normalize(vec3(.0001, 0.,    -1.)) * TARGET_RANGE)


float grid(float scale, vec2 coordinate);
float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print_number(float index, vec2 position);
vec3 hsv(in float h, in float s, in float v);
mat2 rmat(float t);
mat3 rmat(vec3 r);
float contour(float x);
vec3 project(vec3 v, vec3 origin);
mat3 projection_matrix(in vec3 origin, in vec3 target);
float edge(vec2 p, vec2 a, vec2 b, float r);

vec3 axis_plot(vec2 screen, vec3 position, mat3 projection)
{
	vec3 x			= project(position, vec3(2., 0., 0.) * projection);
	vec3 y			= project(position, vec3(0., 2., 0.) * projection);
	vec3 z			= project(position, vec3(0., 0., 2.) * projection);
	float w			= 5.;
	return vec3(edge(screen, position.xy, x.xy, w), edge(screen, position.xy, y.xy, w), edge(screen, position.xy, z.xy, w));
}

void main(void) 
{
	vec2 aspect	= resolution.xy/resolution.yy;
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 m		= (mouse-.5) * aspect;

	
	vec2 panel	= floor(uv * 8.);
	vec3 position	= panel.x < 2. && panel.y <= 2. ? VIEW_X : 
	 		  panel.x < 2. && panel.y <= 4. ? VIEW_Y : 
			  panel.x < 2. && panel.y <= 8. ? VIEW_Z : 
	 		  VIEW_ORBIT;
	
	vec2 screen	= panel.x <= 1. ? (fract(uv*3.) - vec2(.4, .5)) * aspect : (fract(uv) - vec2(.6, .5)) * aspect;
	screen		= normalize(vec3(screen, 1.6)).xy;	
	
	vec3 target	= VIEW_TARGET;
	mat3 projection	= projection_matrix(position, target);
	vec3 origin	= position * projection;
	
	

	vec3 plot	= vec3(0., 0., 0.);
	
	vec3 phi 	= vec3(PHI3, PHI2 + PHI, PHI);	
	vec3 signs	= vec3(1., 0., -1);	

	vec3 basis[4];
	basis[0]	= phi.xyz;
	basis[1]	= phi.zxy;	
	basis[2]	= phi.yzx;	
	basis[3]	= phi.yyy;
	

	vec3 v[32];	
	v[0]		= basis[2] * signs.xyz; 
	v[1]		= basis[3] * signs.xxz;
	v[2]		= basis[1] * signs.xxy; 
	v[3]		= basis[1] * signs.yxx; 
	v[4]		= basis[2] * signs.yxx; 
	v[6]		= basis[3] * signs.xxx; 
	v[7]		= basis[0] * signs.xxy; 
	v[8]		= basis[0] * signs.xyx; 
	
	v[5]		= basis[2] * signs.xyx;
	v[9]		= basis[3] * signs.xzx; 
	v[10]		= basis[0] * signs.xzy; 
	v[11]		= basis[0] * signs.xyz;
	v[12]		= basis[3] * signs.xzz; 
	v[13]		= basis[1] * signs.xzy; 
	v[14]		= basis[1] * signs.yzx; 
	v[15]		= basis[2] * signs.yzx; 
	
	v[16]		= basis[2] * signs.zyx; 
	v[17]		= basis[3] * signs.zzx; 
	v[18]		= basis[1] * signs.zzy; 
	v[19]		= basis[1] * signs.yzz;
	v[20]		= basis[2] * signs.yzz; 
	v[22]		= basis[3] * signs.zzz;
	v[23]		= basis[0] * signs.zzy; 
	v[21]		= basis[2] * signs.zyz;
	
	v[24]		= basis[0] * signs.zyz;
	v[25]		= basis[3] * signs.zxz; 
	v[26]		= basis[0] * signs.zxy; 	
	v[27]		= basis[0] * signs.zyx;
	v[28]		= basis[3] * signs.zxx; 
	v[29]		= basis[1] * signs.zxy; 
	v[30]		= basis[1] * signs.yxz; 
	v[31]		= basis[2] * signs.yxz; 
	
	vec3 z[32];	
	z[0]		= v[9];
	z[1]		= v[10];
	z[2]		= v[5];
	z[3]		= v[8];
	z[4]		= v[14];
	z[5]		= v[13];
	z[6]		= v[15];
	z[7]		= v[8];
	
	for(int i = 0; i < 8; i++)
	{
	//	v[i] 	= z[i];	
	}
	
	float print_res = min(resolution.x, resolution.y);
	print_res	= min(print_res, 640.);

	for(int i = 0; i < 32; i++)
	{		
		vec3 start	= v[i];
		vec3 end 	= v[int(mod(float(i)+1., 32.))];
		
		start		= project(origin, start * projection);
		end		= project(origin, end * projection);;
		
		float start_len	= abs(start.z);
		float end_len	= abs(end.z);
		float max_len	= max(start_len, end_len);
		vec2 z		= vec2(max(start_len, end_len), min(start_len, end_len));
		
		
		float range 	= z.x*(start_len+end_len)*.5;

		float scale 	= range/print_res;

		vec3 hue	= i < 32 ? hsv(mod(float((i)/8)*.8, 4.)/4., .75, 1.-clamp(scale/4., 0., 1.)) : vec3(1., 1., 1.)*.75-scale * .25;
//		hue		*= i == 1 || i == 11 || i == 12 || i == 8 || i == 17 || i == 24 || i == 27 ||  i == 28 ? .25 : 1.;
		
		float line	= edge(screen, end.xy, start.xy, scale);
		
		float index 	= print_number(float(i), floor((-start.xy + screen) * print_res * scale + vec2(2., 3.)));	
		
		
		plot		= max(plot, mix(-line, line, scale) * hue);
		if(i < 32)
		{
			plot	= max(plot, mix(-index, index, 2.5/scale)*(.75+hue*.25));
		}
		
		line		= edge(screen, origin.xy, start.xy, 2.*scale);
		plot		= max(plot, mix(-line, line, .5*scale) * hue);
	}
	
	
	
	plot		+= axis_plot(screen, origin, projection) * .75;	
	
	vec4 buffer	= texture2D(renderbuffer, uv);
	
	gl_FragColor	= vec4(plot,1.);
}//sphinx


//draws a grid
float grid(float scale, vec2 coordinate)
{
	return max(float(mod(coordinate.x, scale) < 1.), float(mod(coordinate.y, scale) < 1.));
}


//returns the bit 1 or 0 from number n at power b
float extract_bit(float n, float p)
{
	n = floor(n);
	p = floor(p);
	p = floor(n/pow(2.,p));
	return float(mod(p,2.) == 1.);
}


//draws the bits of n into a 3 by 5 sprite over p
float sprite(float n, vec2 p)
{
	p 		= floor(p);
	float bounds 	= float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}


//maps input n to the corrosponding float representing it's sprite graphic
float digit(float n, vec2 p)
{
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}


//prints a number n
float print_number(float number, vec2 position)
{	
	float result	= 0.;
	result 		+= number < 0. ? sprite(24., position + vec2(4., 0.)) : 0.;		
	for(int i = 8; i >= 0; i--)
	{
		float place = pow(10., float(i));
		if(number >= place || float(i) < 1.)
		{
			result	 	+= digit(abs(number/place), position);
			position.x 	-= 4.;
		}
	}
	return result;
}


vec3 hsv(in float h, in float s, in float v)
{
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float contour(float x, float r)
{
	return 1.-clamp(x * r * .1*max(resolution.x, resolution.x), 0., 1.);
}




float edge(vec2 p, vec2 a, vec2 b, float r)
{
	vec2 q	= b - a;	
	float u = dot(p - a, q)/dot(q, q);
	u 	= clamp(u, 0., 1.);

	return contour(distance(p, mix(a, b, u)), r);
}


mat3 rmat(vec3 r)
{
	vec3 a  = vec3(cos(r.x) * cos(r.y), sin(r.y), sin(r.x) * cos(r.y));
				
	float c = cos(r.z);
	float s = sin(r.z);
	vec3 as 	= a*s;
	vec3 ac = a*a*(1.- c);
	vec3 ad = a.yzx*a.zxy*(1.-c);
	
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

mat3 projection_matrix(in vec3 origin, in vec3 target) 
{	
	vec3 w          	= normalize(origin-target);
	vec3 u         		= normalize(cross(w,vec3(0.,1.,0.)));
	vec3 v          	= normalize(cross(u,w));
	return mat3(u, v, w);
}


vec3 project(vec3 v, vec3 origin)
{
	v 	+= origin;
	v.z 	= v.z + 1.0;
	v.xy 	/= v.z;
	return v;
}