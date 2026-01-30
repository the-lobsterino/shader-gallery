#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// Created by Stephane Cuillerdier - Aiekick/2016 (twitter:@aiekick)
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Tuned via XShade (http://www.funparadigm.com/xshade/)

vec2 m = vec2(1.2, 0.6);

vec2 path(float t)
{
	return vec2(cos(t*0.3), sin(t*0.3)) * 2.;
}

// famous function from shane
float Voronesque( in vec3 p )
{
    vec3 i  = floor(p+dot(p, vec3(0.333333)) );  p -= i - dot(i, vec3(0.166666)) ;
    vec3 i1 = step(0., p-p.yzx), i2 = max(i1, 1.0-i1.zxy); i1 = min(i1, 1.0-i1.zxy);    
    vec3 p1 = p - i1 + 0.166666, p2 = p - i2 + 0.333333, p3 = p - 0.5;
    vec3 rnd = vec3(5.46,62.8,164.98); 
    vec4 v = max(0.5 - vec4(dot(p, p), dot(p1, p1), dot(p2, p2), dot(p3, p3)), 0.);
    vec4 d = vec4( dot(i, rnd), dot(i + i1, rnd), dot(i + i2, rnd), dot(i + 1., rnd) ); 
    d = fract(sin(d)*1000.)*v*2.; 
    v.x = max(d.x, d.y), v.y = max(d.z, d.w); 
    return max(v.x, v.y);
}

vec2 df(vec3 p)
{
	p.xy -= path(p.z);
	float y = 1.-length(p.xy)+Voronesque(p) * m.x;
	vec2 res = vec2(max(-y, y)-m.y, 1);
    return res;
}

vec3 nor( in vec3 pos, float prec )
{
	vec3 eps = vec3( prec, 0., 0. );
	vec3 nor = vec3(
	    df(pos+eps.xyy).x - df(pos-eps.xyy).x,
	    df(pos+eps.yxy).x - df(pos-eps.yxy).x,
	    df(pos+eps.yyx).x - df(pos-eps.yyx).x );
	return normalize(nor);
}

// Steel Lattice - https://www.shadertoy.com/view/4tlSWl
vec3 blackbody(float t)
{
    float cx = (0.860117757 + 1.54118254e-4*t + 1.28641212e-7*t*t)/(1.0 + 8.42420235e-4*t + 7.08145163e-7*t*t);
    float cy = (0.317398726 + 4.22806245e-5*t + 4.20481691e-8*t*t)/(1.0 - 2.89741816e-5*t + 1.61456053e-7*t*t);
    float d = (2.*cx - 8.*cy + 4.);
    vec3 XYZ = vec3(3.*cx/d, 2.*cy/d, 1. - (3.*cx + 2.*cy)/d);
    vec3 RGB = mat3(3.240479, -0.969256, 0.055648, 
                    -1.537150, 1.875992, -0.204043, 
                    -0.498535, 0.041556, 1.057311) * vec3(1./XYZ.y*XYZ.x, 1., 1./XYZ.y*XYZ.z);
   return max(RGB, 0.)*pow(t*0.0004, 4.); 
}

// from shane sahders
// Tri-Planar blending function. Based on an old Nvidia writeup:
// GPU Gems 3 - Ryan Geiss: http://http.developer.nvidia.com/GPUGems3/gpugems3_ch01.html
vec3 tex3D( sampler2D tex, in vec3 p, in vec3 n ){
   
    n = max((abs(n) - .2)*7., .001);
    n /= (n.x + n.y + n.z );  
    
	p = (texture2D(tex, p.yz)*n.x + texture2D(tex, p.zx)*n.y + texture2D(tex, p.xy)*n.z).xyz;
    
    return p*p;
}

// from shane sahders
// Texture bump mapping. Four tri-planar lookups, or 12 texture lookups in total. I tried to 
// make it as concise as possible. Whether that translates to speed, or not, I couldn't say.
vec3 doBumpMap( sampler2D tx, in vec3 p, in vec3 n, float bf){
   
    const vec2 e = vec2(0.001, 0);
    
    // Three gradient vectors rolled into a matrix, constructed with offset greyscale texture values.    
    mat3 m = mat3( tex3D(tx, p - e.xyy, n), tex3D(tx, p - e.yxy, n), tex3D(tx, p - e.yyx, n));
    
    vec3 g = vec3(0.299, 0.587, 0.114)*m; // Converting to greyscale.
    g = (g - dot(tex3D(tx,  p , n), vec3(0.299, 0.587, 0.114)) )/e.x; g -= n*dot(n, g);
                      
    return normalize( n + g*bf ); // Bumped normal. "bf" - bump factor.
    
}

float SubDensity(vec3 p, float s) 
{
	vec3 n = nor(p,s); 							// precise normale at surf point
	//n = doBumpMap(iChannel0, p, n, s * 0.02);
	return df(p - n * s).x;						// ratio between df step and constant step
}

vec4 light(vec3 ro, vec3 rd, float d, vec3 lightpos, vec3 lc)
{
	vec3 p = ro + rd * d;
	vec3 n = nor(p, 0.01);
	vec3 refl = reflect(rd,n);
		
	vec3 lightdir = normalize(lightpos - p);
	float lightlen = length(lightpos - p);
	
	float amb = 0.6;
	float diff = clamp( dot( n, lightdir ), 0.0, 1.0 );
	float fre = pow( clamp( 1. + dot(n,rd),0.0,1.0), 4. );
	float spe = pow(clamp( dot( refl, lightdir ), 0.0, 1.0 ),16.);
        
	vec3 brdf = vec3(0);
	brdf += amb * vec3(1,0,0); // color mat
	brdf += diff * 0.6;
	brdf += spe * lc * 0.8;
	
	return vec4(brdf, lightlen);
}

vec3 cam(vec2 uv, vec3 ro, vec3 cv, float t)
{
	vec3 cu = normalize(vec3(0,1,0));
  	vec3 z = normalize(cv-ro);
    vec3 x = normalize(cross(cu,z));
  	vec3 y= cross(z,x);
  	return normalize(z + uv.x*x + uv.y*y);
}

void main()
{
    float t = time;
     
	vec2 si = resolution.xy;
    vec2 uv = (2.*gl_FragCoord.xy-si)/si.y;
    
	vec3 col = vec3(0.);
    
	float elev = 0.;
	float ang = t * 0.24;
	float dist = 4.;
	vec3 ro = vec3(path(t),t);
  	vec3 cv = vec3(path(t+0.1),t+0.1);
	vec3 rd = cam(uv, ro, cv, t);
     
	// first point close to the cam, light for the first plane
    vec3 lpNear = ro;

	float md = 9.;
    float s = 1., so = s;
    float d = 0.;
	
	const float iter = 250.;
    for(float i=0.;i<=iter;i++)
    {      
        // from shane shader Maze Lattice https://www.shadertoy.com/view/llGGzh
        if (abs(s) < 0.005*(d*.25 + 1.)||d>md) break;
        s = df(ro+rd*d).x;
		d += s * 0.3;
    }
    
	if (d<md)
	{
		// light close to cam
		vec4 lightNear = light(ro, rd, d, lpNear, vec3(1));
		float attenNear = 0.35 / lightNear.w; // basic attenuation
		col += lightNear.rgb * attenNear;
		
        // heat
        vec3 p = ro + rd * d;
		float sb = 1.-SubDensity(p, 0.2)/0.18;
		col += blackbody(900.*sb-600.);
	}
	gl_FragColor = vec4(col,1);
}