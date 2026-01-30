#ifdef GL_ES
precision mediump float;
#endif

// aiekick mod

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535

struct Ray {
	vec3 pos;
	vec3 dir;
};
	
float udRoundBox( vec3 p, vec3 b, float r )
{
	return length(max(abs(p)-b,0.0))-r;
}

vec3 repPos( vec3 p, vec3 c )
{
    return mod(p,c)-0.5*c;
}


float subFunc(vec3 pos)
{
	float a = mod(atan(pos.y, pos.x), PI / 1.5) - PI / 1.5 / 2.0;
	float xyLen = length(pos.xy);
	a -= pos.z;
	pos.xy = vec2(xyLen * sin(a), xyLen * cos(a));
	pos = repPos(pos, vec3(0.03));
	return udRoundBox(pos, vec3(0.0138), 0.001);
}

float func(vec3 pos)
{
	float a = mod(atan(pos.y, pos.x), PI /2.5) - PI / 1.5 / 2.0;
	float xyLen = length(pos.xy);
	a += pos.z;
	pos.xy = vec2(xyLen * sin(a), xyLen * cos(a));
	pos = repPos(pos, vec3(3.0/7.0));
	return udRoundBox(pos, vec3(0.1), 0.01);
}

float distFunc(vec3 pos)
{
	
	return max(-subFunc(pos), func(pos));
	//return subFunc(pos);
}

vec3 nor( vec3 pos, float prec )
{
	vec3 eps = vec3( prec, 0., 0. );
	vec3 nor = vec3(
	    distFunc(pos+eps.xyy) - distFunc(pos-eps.xyy),
	    distFunc(pos+eps.yxy) - distFunc(pos-eps.yxy),
	    distFunc(pos+eps.yyx) - distFunc(pos-eps.yyx) );
	return normalize(nor);
}

// return color from temperature 
//http://www.physics.sfasu.edu/astro/color/blackbody.html
//http://www.vendian.org/mncharity/dir3/blackbody/
//http://www.vendian.org/mncharity/dir3/blackbody/UnstableURLs/bbr_color.html
vec3 blackbody(float Temp)
{
	vec3 col = vec3(255.);
    col.x = 56100000. * pow(Temp,(-3. / 2.)) + 148.;
   	col.y = 100.04 * log(Temp) - 623.6;
   	if (Temp > 6500.) col.y = 35200000. * pow(Temp,(-3. / 2.)) + 184.;
   	col.z = 194.18 * log(Temp) - 1448.6;
   	col = clamp(col, 0., 255.)/255.;
    if (Temp < 1000.) col *= Temp/1000.;
   	return col;
}

float SubDensity(vec3 surfPoint, float prec, float ms) 
{
	vec3 n;
	float s = 0.;
    const int iter = 10;
	for (int i=0;i<iter;i++)
	{
		n = nor(surfPoint,prec); 
		surfPoint = surfPoint - n * ms; 
		s += distFunc(surfPoint);
	}
	
	return 1.-s/(ms*float(iter)); 
}

float SubDensity(vec3 p, float s) 
{
	vec3 n = nor(p,s); 							
	return distFunc(p - n * s);						
}

vec3 rayMarching(vec2 pos) {
	vec3 cameraPos = vec3(0.0, 0.0, -10.0 +time );
	Ray ray;
	ray.pos = cameraPos;
	ray.dir = normalize(vec3(pos * 2.0, 1.0));
	float d=0.,s=1.;
	for(int i = 0; i < 256; ++i)
	{
		d += (s = distFunc(ray.pos));
		ray.pos += s * ray.dir;
		if (log(d*d/s/1e5)>0.) break;
	}
	
	vec3 p = ray.pos + ray.dir * d;											
	vec3 ld = normalize(ray.pos-p); 										
	vec3 n = nor(p, 0.01);											
	vec3 refl = reflect(ray.dir,n);										
	float diff = clamp( dot( n, ld ), 0.0, 1.0 ); 					
	float fre = pow( clamp( 1. + dot(n,ray.dir),0.0,1.0), 4. ); 			
	float spe = pow(clamp( dot( refl, ld ), 0.0, 1.0 ),16.);		
	vec3 col = vec3(.8,.5,.2);
    
    	float sss = distFunc(p - n*0.001)/0.01;								
	
	float sb = SubDensity(p, 0.01, 0.1);							
	vec3 bb = blackbody(190. * sb);									
	float sss2 = 0.8 - SubDensity(p, 3.); 							
	
	vec3 a = (diff + fre + bb * sss2 * .8 + col * sss * .2) * 0.35 + spe; 
    	vec3 b = col * sss;
    
	return mix(mix(a,b,.8-exp(-0.5*d*d)), vec3(0), 1.-exp(-0.5*d*d));
}

void main( void ) {

	vec2 pos1 = (gl_FragCoord.xy + vec2(0.0, 0.0) - resolution * 0.5)  / resolution.y + mouse - 0.5;
	vec2 pos2 = (gl_FragCoord.xy + vec2(0.0, 0.5) - resolution * 0.5)  / resolution.y + mouse - 0.5;
	vec2 pos3 = (gl_FragCoord.xy + vec2(0.5, 0.0) - resolution * 0.5)  / resolution.y + mouse - 0.5;
	vec2 pos4 = (gl_FragCoord.xy + vec2(0.5, 0.5) - resolution * 0.5)  / resolution.y + mouse - 0.5;
	gl_FragColor = vec4(rayMarching(pos1),1);
	
	
}