#ifdef GL_ES
precision mediump float;
#endif
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform sampler2D backbuffer;

//copied lighting from e#18403

#define THRESHOLD 0.001
#define MAX_STEPS 64

//comment to hide green stuff
//#define SHOWDATA 
 //uncomment to gradually destroy the model.
#define ERODE
//brush radius, 
#define BRUSH 0.1 

// famebuffer dimensions must be higher than SQ*SQ*SQ or greater to work.
#define SQ 5 //increase for higher resolution voxels
const int size=SQ*SQ;
const float fsize = float(size);
const float sq=float(SQ); //square root of the number of voxels in each axis. data is sliced along z and arranged into sq*sq tiles.
const float isq=1./sq;

float sphere(vec3 p, float r)
{
	return length(p) - r;
}

float sdBox( vec3 p, vec3 b )
{
  vec3 d = abs(p) - b;
  return min(max(d.x,max(d.y,d.z)),0.0) +
         length(max(d,0.0));
}
float sdCylinder( vec3 p, vec3 c )
{
  return length(p.xz-c.xy)-c.z;
}
vec3 rotY(vec3 p,float a){
	float s=sin(a), c=cos(a); 
	return vec3(p.z*s+p.x*c,p.y,p.z*c-p.x*s);
}
vec3 rotX(vec3 p,float a){
	float s=sin(a), c=cos(a); 
	return vec3(p.z*s+p.y*c,p.x,p.z*c-p.y*s);
}
float get( vec3 p )
{
	
	if(p.x >=0. && p.x<fsize && p.y>=0. && p.y<fsize && p.z>=0. && p.z<fsize)
	{	
		p.z*=isq;
		vec2 c = p.xy+0.5;
		c.y+=floor(p.z)*fsize;
		c.x+=fract(p.z)*sq*fsize;
			
		float d=  texture2D(backbuffer, c/resolution.xy ).a-0.5;
		d/=4.;
		return d;
	}
	return 0.05;
}

const vec2 o=vec2(0.,1.);

float sdf(  vec3 x )
{
    x+=0.5;
    x*=fsize;
    vec3 p = floor(x);
    vec3 f = fract(x);
	
    float res = mix(mix(mix( get(p), get(p+o.yxx),f.x), mix( get(p+o.xyx), get(p+o.yyx),f.x),f.y),
                    mix(mix( get(p+o.xxy), get(p+o.yxy),f.x), mix( get(p+o.xyy), get(p+o.yyy),f.x),f.y),f.z);
    return res;
}


vec3 normal(vec3 p) {
	vec3 e = vec3(0.0,1./fsize,0.0);
	
	return normalize(vec3(
			sdf(p+e.yxx)-sdf(p-e.yxx),
			sdf(p+e.xyx)-sdf(p-e.xyx),
			sdf(p+e.xxy)-sdf(p-e.xxy)
			)
		);	
}

const float rSpeed = 1.;
vec3 lightdir=-vec3(0.5,1.,0.5);


float softshadow( in vec3 ro, in vec3 rd, float mint, float k )
{
    float res = 1.0;
    float t = mint;
    for( int i=0; i<4; i++ )
    {
        float h = sdf(ro + rd*t);
		h = max( h, 0.0 );
        res = min( res, k*h/t );
        t += clamp( h, 0.01, 0.5 );
    }
    return clamp(res,0.0,1.0);
}


float light(in vec3 p, in vec3 dir) {
	vec3 ldir=normalize(lightdir);
	vec3 n=normal(p);
	float sh=1.;//softshadow(p,-ldir,1./fsize,20.);
	float diff=max(0.,dot(ldir,-n));
	vec3 r = reflect(ldir,n);
	float spec=max(0.,dot(dir,-r));
	return diff*sh+pow(spec,30.)*.5*sh+.15*max(0.,dot(normalize(dir),-n));	
		}
float rand(vec2 co){
	return fract(sin(dot(co.xy, vec2(12.9898,78.233)))*43758.5453);
}

float scene(vec3 p)
{
    	return sdf(p);	
}


vec3 trace(vec3 ro, vec3 rd, out bool hit)
{
	hit = false;
	vec3 pos = ro+rd;
	pos.z-=2.;
	
	pos=rotY(pos,time*rSpeed);
	rd =rotY(rd,time*rSpeed);
	
	for( int i=0;i<MAX_STEPS;i++)
	{
		float d = scene(pos);
		if(d<THRESHOLD ) {
			hit = true;
			return pos;
		}
		pos += d*rd;
	}
	return pos;
}



void main( void ) {

	//subtracting exactly one seems to break it in Firefox for some reason?!..
	vec2 position = ( (gl_FragCoord.xy/resolution.xy)*2. -vec2(1.00001)); 
	
	vec2 pxl = gl_FragCoord.xy;	
	float a = texture2D(backbuffer, (pxl)/resolution.xy ).a;
	
	a-=0.5;
	a/=4.;
	#ifdef ERODE
		a+=0.0007;
	#endif
	int page = int(pxl.y)/size;
	int frame = int(pxl.x)/size;
	
	if(page<SQ && frame<SQ)
	{
		//calc coords of this pixel's voxel
		vec3 c   = vec3( mod(pxl,float(size)) ,float(page)*sq + float(frame) );
		c/=fsize;
		c-=0.5;
		
		vec2 t = vec2(time*11.11,-time*0.311);
		vec3 k=vec3(1.-mouse.x,1.-mouse.y,0.5);
		//vec3 k =vec3(rand(t.xy),fract(time),fract(time*.1));
		k-=0.5;
		k*=1.2;
		k=rotY(k,time*rSpeed);
		a= min( a, max(sphere(c+k,BRUSH),sdCylinder(c+0.5,vec3(0.5)))); 
	}
	
	a*=4.;
	a+=0.5;
	
	if( texture2D(backbuffer, vec2(0.) ).a ==0.)
		a=1.;
	if(floor(pxl.y)==0.)
	   	a=1.;
	
	float foc = 1.;
	
	vec3 rgb = vec3(0.0);
	vec3 rf = vec3(position.x*foc,position.y*foc, foc*3.5);

	vec3 ro=vec3(0.);
	vec3 rd=normalize(rf-ro);
	bool hit;
	vec3 pos = trace(ro,rd,hit);
		
	float f = 0.1/length(pos);

	if (hit)
	{
		rgb += light(pos,rd);
		rgb += pos;
		
	}
	else
	    rgb+= vec3(position*0.2,0.2);
#ifdef SHOWDATA
	gl_FragColor = vec4(rgb.r,rgb.g+1.-a,rgb.b,a);
#else
	gl_FragColor = vec4(rgb,a);
#endif
	
	
}