#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;

//maybe some comments? I got a lot goin on, okay?

vec3 hsv(in float h, in float s, in float v){
    return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}


vec3 sphericalharmonic(vec3 n)
{     
	vec4 c[7];
	c[0] = vec4(0.0, 0.5, 0.0, 0.4);
	c[1] = vec4(0.0, 0.3, .05, .45);
	c[2] = vec4(0.0, 0.3, -.3, .85);
	c[3] = vec4(0.0, 0.2, 0.1, 0.0);
	c[4] = vec4(0.0, 0.2, 0.1, 0.0);
	c[5] = vec4(0.1, 0.1, 0.1, 0.0);
	c[6] = vec4(0.0, 0.0, 0.0, 0.0);  
	
	vec4 p = vec4(n, 1.);

	vec3 l1 = vec3(0.);
	l1.r = dot(c[0], p);
	l1.g = dot(c[1], p);
	l1.b = dot(c[2], p);

	vec4 m2 = p.xyzz * p.yzzx;
	vec3 l2 = vec3(0.);
	l2.r = dot(c[3], m2);
	l2.g = dot(c[4], m2);
	l2.b = dot(c[5], m2);

	float m3 = p.x*p.x - p.y*p.y;
	vec3 l3 = vec3(0.);
	l3 = c[6].xyz * m3;

	vec3 sh = vec3(l1 + l2 + l3);

	return clamp(sh, 0., 1.);
}


float hash(float v)
{
    return fract(fract(v*9876.5432)*(v+v)*12345.678);
}

float cube(vec3 p, vec3 s)
{
	vec3 d 	= (abs(p) - s);
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

float cone(vec3 p, float l, vec2 r)
{
	float m = 1.-(p.y*.5)/l;
	return max(length(p.xz)-mix(r.y, r.x, m), abs(p.y-l)-l);
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


vec3 global_color;
#define axis ((cos(time/10.)*cos(time/10.))*normalize(abs(vec3(cos(gl_FragCoord.x), 2./gl_FragCoord.x-2./gl_FragCoord.y, sin(gl_FragCoord.y))))*4.)
mat3 rotation;
float map(vec3 p) 
{

	vec3 o 		= vec3(1., 1.5, 5.);
	p		-= o;
	p.xz 		*= rmat(time * .0125);
	
	float s 		= 1.5;
	const int it 	= 14;
	float u		= pow(s, -float(it) - 1.);
	global_color 	= vec3(0.);
	
	for(int i = 0; i < it; i++) 
	{
		p = abs(p * rotation) * s - axis * .5;
		global_color += cos(p*2.);
	}

	return max(max(p.x, p.y), p.z)*u;
}

float curvature(const in vec3 position , const in float epsilon) //via nimitz
{
	vec2 offset = vec2(epsilon, -epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map(position + offset.xyy);
	simplex.y = map(position + offset.yyx);
	simplex.z = map(position + offset.yxy );
	simplex.w = map(position + offset.xxx);
	return .2/epsilon*(dot(simplex, vec4(1.)) - 4. * map(position));
}

vec3 derive(const in vec3 position , const in float epsilon)//, out float cuvature)
{
	vec2 offset = vec2(epsilon, -epsilon);
	vec4 simplex = vec4(0.);
	simplex.x = map(position + offset.xyy);
	simplex.y = map(position + offset.yyx);
	simplex.z = map(position + offset.yxy );
	simplex.w = map(position + offset.xxx);
	//cuvature = 1./epsilon*(dot(simplex, vec4(1.)) - 4. * map(position));
	vec3 gradient = offset.xyy * simplex.x + offset.yyx * simplex.y + offset.yxy * simplex.z + offset.xxx * simplex.w;
	return gradient;
}


void main( void ) {

	vec2 uv		= gl_FragCoord.xy / resolution.xy;
	uv		= uv * 2. - 1.;
	uv		*= resolution.xy/resolution.yy;
	
	vec3 origin 	= vec3(0., 1.25, 0.);
	vec3 position 	= origin;
	float fov	= 1.1;
	vec3 direction	= normalize(normalize(vec3(uv, fov)));
	vec2 m		= (mouse-.5)*(8.*atan(1.));
	
	//direction.xz 	*= rmat(m.x/4.);
	//direction.yz 	*= rmat(m.y/4.-.5);
	
	rotation 		= rmat(axis);
	
	float threshold		= 1./min(resolution.x, resolution.y);
	float magnitude		= threshold;
	float range 		= 0.;
	float steps		= 0.;
	vec3 gradient		= vec3(0.);
	float exponent  		= .95;
	float epsilon 		= threshold;
	float refine_steps	= 4.;
	const float max_range	= 7.;
	const int iterations 	= 48;
	vec3 min_position	= origin;
	float min_range		= max_range;
	for(int i = 0; i < iterations; i++)
	{
		if(range < max_range) 
		{
			if(magnitude >= threshold * 8.)
			{
				magnitude 	= map(position);
				
				min_position	= min_range > magnitude ? position : min_position;
				min_range	= min_range > magnitude ? magnitude : min_range;
				

				range 		+= magnitude * .8;		
				threshold 	*= 1.0625;
			
				epsilon 	= pow(range/min(resolution.x, resolution.y), exponent);
				exponent	-= threshold;
				position 	= origin + direction * range * (1.+epsilon);
				
				steps++;
			}
			else if(magnitude >= threshold && refine_steps > 0.)
			{
				magnitude 		= map(position);
				gradient		= derive(position, epsilon * refine_steps);//, curvature);
				position		+= gradient;
				refine_steps--;
			}
		}
	}
	
	range 			= distance(origin, position);
	epsilon 			= pow(range/min(resolution.x, resolution.y), exponent);
	
	
	vec3 normal		= vec3(0.);
	vec3 color		= vec3(0.);
	
	if(range < max_range)
	{
		float fog 		= .5 * clamp(-exp2(range), 0., 1.) - abs(steps/float(iterations+1));
		
		float edges		=  curvature(position, epsilon * 8.);
		edges			+= curvature(position, epsilon * 4.);
		edges			+= curvature(position, epsilon * 2.);
		
		normal			= normalize(gradient);
		
		float light		= clamp(dot(normal, normalize(vec3(4.,32., 12.))), 0., .25);
		color			= 1.-mix(sphericalharmonic(-normal), sphericalharmonic(reflect(direction, normalize(1.-normal))), max(1.-cos(dot(direction, normal)),0.));
		color			= mix(color, normalize(global_color)*.5+.5, .65);
		color			*= .65 + .8*fog + edges;
		color			+= light ;
	}
	else 
	{
		normal		= normalize(min_position);
		color		= sphericalharmonic(normalize(position-normal));
		magnitude	= map(min_position);
		float field	= .125/min_range*magnitude/map(min_position);
		float edges	= abs(float(curvature(min_position, epsilon*.35)*8.));;
		color		+= color * field * edges;
	}
	
	
	gl_FragColor = vec4(color, 1.);

}//sphinx + the dude who made the curvature stuff (nimitz)