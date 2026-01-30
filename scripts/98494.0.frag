/* 
 *  andromeda
 *
 *  just hacked two shaders together veeery dirty...
 *
 */ 

precision highp float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
vec2 m = mouse.xy*resolution;
//
// GLSL textureless classic 3D noise "cnoise",                                           "hyperboled"
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// with an RSL-style periodic variant "pnoise".
// Version: 2011-10-11
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

// slow mod by @kapsy1312

vec3 col = vec3(0., 0., 0.);

#define tau		         6.283185307179586

#define SURF_DIST .001
#define rot( a )         	 mat2( cos(a), -sin(a), sin(a), cos(a) )
#define REFRACTION_INDEX 1.005
// 1.053

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec3 color(vec3 ro, vec3 rd, vec3 n, float t){
    vec3 p = ro + rd*t;
    vec3 lp = ro + vec3(.0, .0, 1.7);
    vec3 objCol = vec3(0.0, 0.0, 0.0);
    vec3 cell = vec3(-5.0, ceil(4.*sin(time*2.)-0.5), 4.0);
    vec3 ld = normalize(lp-p);
    float dd = length(p-lp);
    float dif = max(dot(n, ld), .1);
    float fal = 1.5 / dd;
    float spec = pow(max(dot( reflect(-ld, n), -rd), 0.), 31.);

    objCol = hsv2rgb(vec3(0.67, 0.766, 0.7));
    objCol *= (dif + .2);
    objCol += spec * 0.6;
    objCol *= fal;
    return objCol;
}

float sdTetrahedron2( vec3 p ) 
{ 
	return (max(
	    abs(p.x+p.y)-p.z,
	    abs(p.x-p.y)+p.z
	)-1.)/sqrt(3.);
}

float GetDist(vec3 p) {
    p.xz *= rot(-(mouse.x*3.-.5));
    p.yz *= rot(mouse.y*2.-.5);
 
    float d = 0.0;
    p/=4.;
    p.xy *= rot(1.*time);
    p.xz *= rot(0.5*time);
    float tetra1 = sdTetrahedron2( p );
    p.xy *= rot ( tau/4. );
    float tetra2 = sdTetrahedron2( p );
    d = min( tetra1, tetra2 );
    return d;
}

vec3 normal( in vec3 pos )
{
    vec2 e = vec2(0.002, -0.002);
    return normalize(
        e.xyy * GetDist(pos + e.xyy) + 
        e.yyx * GetDist(pos + e.yyx) + 
        e.yxy * GetDist(pos + e.yxy) + 
        e.xxx * GetDist(pos + e.xxx));  
}

int RayMarch(vec3 ro, vec3 rd) 
{
    int nHits = 0;
    float d = 0.0, t = 0.0, ns = 0.;
    vec3 p, n;
    for(int i = 0; i < 333; i++)
    {
    	d = GetDist(ro + rd*t); 
        if(nHits >= 10 || t >= 25.) break;
        if(abs(d) < .00495){
            p = ro + rd*t;
            n = normal(p);
            if(d > 0. && nHits == 0) rd = refract(rd, n, 1./REFRACTION_INDEX);  // use the inverse of the RI here... your welcome. ;) 
            col += color(ro, rd, n, t) * 0.9;
            nHits++;
            t += 0.1;
        }
        t += abs(d) * 1.0;
        
        if(nHits == 0) ns++;
    }
    return nHits;
}

vec3 R(vec2 uv, vec3 p, vec3 l, float z) {
    vec3 f = normalize(l-p),
        r = normalize(cross(vec3(0,1,0), f)),
        u = cross(f,r),
        c = p+f*z,
        i = c + uv.x*r + uv.y*u,
        d = normalize(i-p);
    return d;
}

vec4 merkaba( vec2 p )
{
     p *= 2.0;;//*mouse.y;
    vec3 ro = vec3(0.0, 0.0, -13.);
    vec3 rd = R(p, ro, vec3(0,0,0), 1.0);  // i changed this from vec3(0,1,0)
    int hits = RayMarch(ro, rd);
    col = pow(col, vec3(.74545));	// gamma correction	
    vec4 R = vec4( col*1.5, float(hits) );
    return R;
}

vec3 mod289(vec3 x) {   return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) {  return x - floor(x * (1.0 / 289.0)) * 289.0;}
vec4 permute(vec4 x) {   return mod289(((x*1.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) {   return 1.79284291400159 - 0.85373472095314 * r; }
vec3 fade(vec3 t) {   return t*t*t*(t*(t*6.0-15.0)+10.0);}

// Classic Perlin noise
float cnoise(vec3 P)
{
  vec3 Pi0 = floor(P); // Integer part for indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;

  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);

  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);

  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);

  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;

  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);

  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
  return 2.2 * n_xyz;
}

float surface3 ( vec3 coord ) {
	
	float frequency = 14.1;
	float n = 0.0;	
		
	n += 1.0	* abs( cnoise( coord * frequency ) );
	
	//maybe theses are the octaves?
	//n += 0.5	* abs( cnoise( coord * frequency * 2.0 ) );
	//n += 0.25	* abs( cnoise( coord * frequency * 4.0 ) );
	
	return n;
}

vec3 greenCNoise( vec2 p )
{

	//#define p position
	p/=dot(p,p);
	p -= m/80.; p*=.1;
 	float n = surface3(vec3(p, time * 0.051));
	float nn = 1.0 - n;
	nn = nn*nn*nn*nn*nn*nn*nn;
	return vec3(0., nn, 0.);
}

void main( void ) {
	
	vec2 position = (gl_FragCoord.xy - resolution/2.)/ resolution.y;

	vec3 c = vec3( 0. );
	vec4 cc = merkaba( position);
	cc.xyz *= 4.;
	float factor =1.;
	if ( cc.a >= 1.) factor = 0.18; 
	
	c += greenCNoise( position )*factor;
	c += cc.xyz*vec3( 1.25, 1., 1.15);
	
	gl_FragColor = vec4( c, 1. ); 
}
