#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//rhombic triacontahedron
//sphinx

#define minkowski(v, m) pow(dot(pow(v, v*0.+m), v*0.+1.), 1./m)
#define TAU 	(8. * atan(1.))
#define PHI 	((sqrt(5.)+1.)*.5)
#define PHI2 	(PHI*PHI)
#define PHI3 	(PHI*PHI*PHI)


vec4 v 		= vec4(PHI3, PHI2, PHI, 0.);

#define V0 	v.xyw
#define V1 	v.ywx
#define V2 	v.wxy


#define V3 	v.wzx
#define V4 	v.xwz
#define V5 	v.zxw

#define V6 	v.yyy


//#define VIEW_POSITION vec3(0., 0., time*.000125)
//#define VIEW_POSITION vec3(0., 0., -32.)
#define VIEW_POSITION vec3(0., 0., -80.)

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float cube(vec3 p, vec3 s)
{
	vec3 d = (abs(p) - s);
	return min(max(d.x,max(d.y,d.z)),0.0) + length(max(d,0.0));
}


float segment(vec3 p, vec3 a, vec3 b, float r)
{

	vec3 pa = p - a;
	vec3 ba = b - a;
	float h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);


//	return min(length(pa - ba * h), min(length(p-b), length(pa))-r*6.)-r;
	//return min(length(pa - ba * h),length(p)-r*24.)-r;
	//return min(length(p-b), length(pa))-r*6.;
	return length(pa - ba * h)-r;
	//return length(p)-r*24.;
}



float rtp(vec3 position, float radius)
{		
	float t 	= time * .5;

	position	= abs(position);

	float range 	= 8192.;
	range		= min(range, segment(position, V0, V6, radius)); //x
	range		= min(range, segment(position, V1, V6, radius)); //x
	range		= min(range, segment(position, V2, V6, radius)); //x	
	range		= min(range, segment(position, V0, V5, radius)); //s
	range		= min(range, segment(position, V1, V4, radius)); //s
	range		= min(range, segment(position, V2, V3, radius)); //s
	range		= min(range, segment(position, V0, V4, radius)); //r
	range		= min(range, segment(position, V1, V3, radius)); //r
	range		= min(range, segment(position, V2, V5, radius)); //r	
	range		= min(range, segment(position, V2, V5, radius)); //r
	
	return range;
}


float dot2( in vec3 v ) { return dot(v,v); }
float udQuad( vec3 p, vec3 a, vec3 b, vec3 c, vec3 d )
{
    vec3 ba = b - a; vec3 pa = p - a;
    vec3 cb = c - b; vec3 pb = p - b;
    vec3 dc = d - c; vec3 pc = p - c;
    vec3 ad = a - d; vec3 pd = p - d;
    vec3 nor = cross( ba, ad );

    return sqrt(
    (sign(dot(cross(ba,nor),pa)) +
     sign(dot(cross(cb,nor),pb)) +
     sign(dot(cross(dc,nor),pc)) +
     sign(dot(cross(ad,nor),pd))<3.0)
     ?
     min( min( min(
     dot2(ba*clamp(dot(ba,pa)/dot2(ba),0.0,1.0)-pa),
     dot2(cb*clamp(dot(cb,pb)/dot2(cb),0.0,1.0)-pb) ),
     dot2(dc*clamp(dot(dc,pc)/dot2(dc),0.0,1.0)-pc) ),
     dot2(ad*clamp(dot(ad,pd)/dot2(ad),0.0,1.0)-pd) )
     :
     dot(nor,pa)*dot(nor,pa)/dot2(nor) );
}



float rtp2(vec3 position, float radius)
{		
	float t 	= time * .5;

	position	= abs(position);

	vec4 v 		= vec4(PHI3, PHI2, PHI, 0.);
	
	float qa	= udQuad(position, v.yyy, v.xyw, v.xwz, v.ywx);
	float qb	= udQuad(position, v.yyy, v.ywx, v.wzx, v.wxy);
	float qc	= udQuad(position, v.yyy, v.wxy, v.zxw, v.xyw);
	float qd	= udQuad(position, v.xwz, v.xyw,  v.xyw, v.xwz * vec3(1., 1., -1.));
	float qe	= udQuad(position, v.wzx, v.ywx,  v.ywx, v.ywx * vec3(-1., 1., 1.));
	float qf	= udQuad(position, v.wxy, v.zxw,  v.zxw, v.zxw * vec3(-1., 1., 1.));
	float range 	= min(min(min(min(min(qa, qb), qc), qd), qe), qf)+.01;
	
	return range;
}


float map(vec3 position)
{
	vec3 origin 	= position;
		
//	origin.xy 	*= rmat(mouse.x*TAU);
//	origin.xz 	*= rmat(mouse.y*TAU-TAU/2.);
	origin.xy 	*= rmat(time * (PHI/32.));
	origin.xz 	*= rmat(time * (PHI/53.));
	float c		= cube(origin, vec3(17.));
	float radius 	= .0285;
	float range 	= 8192.;	
	
	float k 	= 13.7082039325/PHI;

	origin		*= .25;
	

	
	//float iteration = max(1., abs(cos(time*.125))* 8.);
	float iteration = pow(abs(cos(time*.125))*32.,.5);
	if(iteration > 1.)
	{
		range 	= min(range, rtp(mod((origin*iteration)+k/2., k)-k/2., radius*(1.+iteration)));		
		range 	= min(range, rtp(origin*iteration, abs(cos(time*1.3))*9.*radius));	
		range 	= max(range,c);
	}

	float b 	= length(position-VIEW_POSITION)-8.;
	range 		= max(range, rtp2(origin, 1.));	


	range 	= min(range, rtp(origin, .001));	
	
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


void main( void ) 
{
	vec2 aspect		= resolution.xy/resolution.yy;
	
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	uv 			= (uv - .5) * aspect;
	
	vec2 m			= (mouse-.5) * aspect;
	
	
	
	vec3 direction  	= normalize(vec3(uv, PHI));

	vec3 origin		= VIEW_POSITION;
	vec3 position		= origin;
	
	
	
	//raytrace
	float minimum_range	= 16./max(resolution.x, resolution.y);
	float max_range		= 8192.;
	float range		= max_range;
	float total_range	= 0.;
	float steps 		= 0.;
	origin 			-= direction;		
	for(int count = 1; count < 256; count++)
	{
		if(range > minimum_range && total_range < max_range)
		{
			steps++;
			
			range 		= map(position);
			range		*= .75;

			
			total_range	+= range;

		
			position 	= origin + direction * total_range;	
		}
	}
	
	position 	-= direction * .00125;

	vec3 background_color 	= (vec3(.375, .375, .5) - uv.y) * .8625;
	vec3 material_color	= vec3( .45, .35, .12) * .85;	
	vec3 color 		= background_color;
	if(steps < 255. && total_range < max_range)
	{
		vec3 surface_direction 	= derive(position, minimum_range);
	
		vec3 light_position 	= VIEW_POSITION+vec3(-64., 32., -16.);
		vec3 light_direction	= normalize(light_position - position);
		
		float light		= max(dot(surface_direction, light_direction), 0.);
		
		
		color 			+= material_color + material_color * light + light;
		color 			-= max(material_color/total_range, -background_color);
		color			+= max(abs(total_range/steps*15.)*.0125, .125);
		color			*= .85;
	}
	else
	{
		color 			= background_color + pow(steps*.0067, 3.);
	}
		
	color 				= pow(color * .5, vec3(1.6, 1.6, 1.6));
	
	gl_FragColor 			= vec4(color, 1.);
}//sphinx