#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//rhombic triacontahedron
//sphinx

#define VIEW_POSITION 	vec3(0., 0., -32.)
	
#define MAX_FLOAT 	(pow(2., 128.)-1.)
	
#define TAU 		(8. * atan(1.))
#define PHI 		((sqrt(5.)+1.)*.5)
#define PHI2 		(PHI*PHI)
#define PHI3 		(PHI*PHI*PHI)

#define SLICE		(mouse.x * resolution.x < gl_FragCoord.x);
#define MINKOWSKI(v, m) pow(dot(pow(v, v*0.+m), v*0.+1.), 1./m)




vec3 g_color 		= vec3(0.,0.,0.);

vec3 e_color 		= vec3(1., 1., 1.);
vec3 f_color 		= vec3(1., 1., 1.);
vec3 v_color 		= vec3(1., 1., 1.);

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


vec3 hsv(in float h, in float s, in float v)
{
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


float dot2(in vec3 v) 
{ 
	return dot(v,v); 
}

float max_component(vec3 v)
{
	return max(max(v.x, v.y), v.z);	
}

float cube(vec3 p, vec3 s)
{
	vec3 d = abs(p) - s;
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float edge(vec3 p, vec3 a, vec3 b)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
	return length(pa - ba * h);
}



float rhombictriacontahedron(vec3 p, float r)
{
	//face normals
	vec3 q = vec3(.30901699437, .5,.80901699437);	
	p	= abs(p);	
	return  max(max(max(max(max(max(p.x, p.y), p.z), dot(p.zxy, q)), dot(p.xyz, q)), dot(p.yzx, q)) - r, 0.);
}


float rtc_edges(vec3 position, float scale)
{		
	position	= abs(position);
	vec4 v 		= vec4(PHI3, PHI2, PHI, 0.) * scale;
	
	float ea	= edge(position, v.xyw, v.yyy);
	float eb	= edge(position, v.xyw, v.xwz);
	float ec	= edge(position, v.xyw, v.zxw);
	float ed	= edge(position, v.ywx, v.yyy);
	float ee	= edge(position, v.ywx, v.wzx);
	float ef	= edge(position, v.ywx, v.xwz);
	float eg	= edge(position, v.wxy, v.yyy);
	float eh	= edge(position, v.wxy, v.wzx);
	float ei	= edge(position, v.wxy, v.zxw);
	float edges	= min(min(min(min(min(min(min(min(ea, eb), ec), ed), ee), ef), eg), eh), ei);
	
	/*
	e_color 	= ea == edges ? vec3(1., 0., 1.) : e_color;
	e_color 	= eb == edges ? vec3(1., 1., 0.) : e_color;
	e_color 	= ec == edges ? vec3(1., 1., 1.) : e_color;
	e_color 	= ed == edges ? vec3(0., 1., 0.) : e_color;
	e_color 	= ee == edges ? vec3(0., 1., 1.) : e_color;
	e_color 	= ef == edges ? vec3(1., 0., 0.) : e_color;
	e_color 	= eg == edges ? vec3(0., 0., 0.) : e_color;
	e_color 	= eh == edges ? vec3(-1., -1., -1.) : e_color;
	e_color 	= ei == edges ? vec3(0., 0., 1.) : e_color;
	*/
	return edges;
}



float rtc_paths(vec3 position, float scale)
{		
	position	= abs(position);
	vec4 v 		= vec4(PHI3, PHI2, PHI, 0.) * scale;
	
	float edges	= MAX_FLOAT;
	
	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.yyy));

	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.xwz));	
	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.zxw));
	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.wzx));	

	position	= position.zyx/PHI;
	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.ywz)*PHI);	
	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.zyw)*PHI);
	edges		= min(edges, edge(position, vec3(0., 0., 0.), v.wzy)*PHI);	
	
	return edges;
}



float rtc_embedding(vec3 position, float scale, float radius)
{	
	vec3 origin	= position;
	vec3 octant	= sign(position);

	radius 		*= 1.5;
	vec4 v 		= vec4(PHI3, PHI2, PHI, 0.);

	float edges	= MAX_FLOAT;
	scale		= PHI;
	#define A	true
	#define B	(mouse.y < .75)
	#define C	(mouse.y < .5)
	#define D	(mouse.y < .25)
	
	if(A)
	{
		edges		= rtc_edges(position, scale*PHI*.85)-radius;
	}
	float a			= edges;
	radius 			*= .5;
	
	
	
	
	if(B)
	{
		position	= abs(origin);
		edges		= min(edges, rtc_paths(position, scale)-radius);
	}
	float b			= edges;
	radius 			*= .5;
	
	
	
	
	if(C)
	{
		
		scale 		/= PHI;	

		position	= abs(origin);
		
		edges		= min(edges, rtc_paths(position - v.yyy, scale)-radius);
		edges		= min(edges, rtc_paths(position - v.xwz, scale)-radius);
		edges		= min(edges, rtc_paths(position - v.zxw, scale)-radius);
		edges		= min(edges, rtc_paths(position - v.wzx, scale)-radius);
		edges		= min(edges, rtc_paths(position - v.ywx, scale)-radius);
		edges		= min(edges, rtc_paths(position - v.wxy, scale)-radius);
		edges		= min(edges, rtc_paths(position - v.xyw, scale)-radius);	
	}
	float c			= edges;
	radius 			*= .5;
	
	
	
	
	if(D)
	{
		vec4 k		= v.xyzw;
	
		v 		/= PHI;
		scale		/= PHI;
		position	= abs(abs(origin)-k.yyy);
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));
		
		position	= abs(abs(origin)-k.xwz);	
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));
		
		position	= abs(abs(origin)-k.zxw);	
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));
		
		position	= abs(abs(origin)-k.wzx);	
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));
		
		position	= abs(abs(origin)-k.ywx);	
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));
		
		position	= abs(abs(origin)-k.wxy);	
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));
		
		position	= abs(abs(origin)-k.xyw);	
		edges		= min(edges, rtc_paths(position - v.yyy, scale));
		edges		= min(edges, rtc_paths(position - v.xwz, scale));
		edges		= min(edges, rtc_paths(position - v.zxw, scale));
		edges		= min(edges, rtc_paths(position - v.wzx, scale));
		edges		= min(edges, rtc_paths(position - v.ywx, scale));
		edges		= min(edges, rtc_paths(position - v.wxy, scale));
		edges		= min(edges, rtc_paths(position - v.xyw, scale));	
	}
	float d		= edges;
	

	
	e_color 	= d == edges ? vec3(0., 0., 1.) : e_color;	
	e_color 	= c == edges ? vec3(0., 1., 0.) : e_color;	
	e_color 	= b == edges ? vec3(1., 0., 0.) : e_color;	
	e_color 	= a == edges ? vec3(1., 1., 1.) : e_color;
	e_color		+= .5;
	e_color		= 1.-clamp(e_color, vec3(0., 0., 0.), vec3(1., 1., 1.));


	return edges-radius;
}



vec3 position_origin(vec3 p)
{
	p	= p;
	p.zy 	*= rmat(mouse.y*TAU*4.-TAU*.5);
	p.xz 	*= rmat(mouse.x*TAU+TAU/2.);
//	p.xz 	*= rmat(time * .0625);
//	p.yz 	*= rmat(time * .0625);
	return p;
}

float bound(vec3 p, float scale)
{
	return cube(p, vec3(scale)*3.);	
}

void init_map(in vec3 position, out vec3 origin, out float range, out float scale, out float radius, out float bounds)
{
	range 	= MAX_FLOAT;
	
	origin	= position_origin(position);
			
	scale 	= 1.;
	
	radius 	= .025;
	position.xz *= rmat(.9);
	bounds	= bound(position + vec3(mouse.x>.75 ? -15.75*PHI :0., 0., 0.), scale * PHI3 * 2.);
}


float map(vec3 position)
{
	vec3 origin;
	float range, scale, radius, bounds;
	init_map(position, origin, range, scale, radius, bounds);


	
	float embedding = rtc_embedding(origin, scale, radius);	

	range 		= embedding;
	g_color 	+= e_color*.0625;
	
	range		= max(bounds, range);
	
	return range;
}


vec3 derive(in vec3 position, in float range)
{
	vec2 offset     = vec2(0., range);
	vec3 normal     = vec3(0.);
	normal.x    	= map(position+offset.yxx)-map(position-offset.yxx);
	normal.y    	= map(position+offset.xyx)-map(position-offset.xyx);
	normal.z    	= map(position+offset.xxy)-map(position-offset.xxy);
	return normalize(normal);
}


float smoothmin(float a, float b, float x)
{
	return -(log(exp(x*-a)+exp(x*-b))/x);
}


float shadow(vec3 origin, vec3 direction, float mint, float maxt, float k) 
{
	float sh = 1.0;
	float t = mint;
	float h = 0.0;
	for (int i = 0; i < 16; i++) 
	{
		if (t > maxt)			
			continue;
			h 	= map(origin + direction * t);
			sh 	= smoothmin(sh, k * h/t, 8.0);
			t 	+= clamp( h, 0.01, 0.5 );		
	}
	return clamp(sh, 0., 1.);
}



float ambient_occlusion(vec3 position, vec3 normal)
{	   
	float delta 	= 0.125;
	float occlusion = 0.0;
	float t 	= .2;
	for (float i = 1.; i <= 6.; i++)
	{
	    occlusion	+= t * (i * delta - map(position + normal * delta * i));
	    t 		*= .5;
	}
 	
	const float k 	= 4.0;
	return 1.0 - clamp(k * occlusion, 0., 1.);
}


void main( void ) 
{
	vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	uv 			= (uv - .5) * aspect;
	
	vec2 m			= (mouse-.5) * aspect;
	
	
	
	vec3 direction  	= normalize(vec3(uv, 1.3));

	vec3 origin		= VIEW_POSITION;
	vec3 position		= origin;
	
	
	
	//raytrace
	float minimum_range	= 8./max(resolution.x, resolution.y);
	float max_range		= 48.;
	float range		= max_range;
	float total_range	= 3.;
	float steps 		= 0.;
	
	vec3 background_color 	= vec3(1., 1., 1.);
	vec3 light_color	= vec3( .95, .85, .7)  * .5;	
	
	vec3 color 		= background_color;
	
	float origional_range	= range;
	
	const int iterations 	= 64;
	for(int count = 1; count < iterations; count++)
	{
		if(range > minimum_range && total_range < max_range)
		{
			steps++;
			
			range 		= min(map(position), 2.);
			range		*= .99;
			minimum_range	*= 1.015;

			
			total_range	+= range;

		
			position 	= origin + direction * total_range;	
		}
	}
	


	if(steps < float(iterations-1) && range <= minimum_range)
	{
		color				= 1.-g_color;
		color				-= pow(total_range*.02,3.);
	}
	else
	{
		color		= vec3(0., 0., 0.);	
	}
	
	gl_FragColor 			= vec4(color, 1.);
}//sphinx