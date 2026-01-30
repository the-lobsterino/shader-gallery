#ifdef GL_ES
precision mediump float;
#endif
//11:12
//11:36

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//
// GLSL textureless classic 2D noise "cnoise",
// with an RSL-style periodic variant "pnoise".
// Author:  Stefan Gustavson (stefan.gustavson@liu.se)
// Version: 2011-08-22
//
// Many thanks to Ian McEwan of Ashima Arts for the
// ideas for permutation and gradient selection.
//
// Copyright (c) 2011 Stefan Gustavson. All rights reserved.
// Distributed under the MIT license. See LICENSE file.
// https://github.com/ashima/webgl-noise
//

vec4 mod289(vec4 x)
{
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x)
{
  return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

vec2 fade(vec2 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}

// Classic Perlin noise
float cnoise(vec2 P)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod289(Pi); // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

// Classic Perlin noise, periodic variant
float pnoise(vec2 P, vec2 rep)
{
  vec4 Pi = floor(P.xyxy) + vec4(0.0, 0.0, 1.0, 1.0);
  vec4 Pf = fract(P.xyxy) - vec4(0.0, 0.0, 1.0, 1.0);
  Pi = mod(Pi, rep.xyxy); // To create noise with explicit period
  Pi = mod289(Pi);        // To avoid truncation effects in permutation
  vec4 ix = Pi.xzxz;
  vec4 iy = Pi.yyww;
  vec4 fx = Pf.xzxz;
  vec4 fy = Pf.yyww;

  vec4 i = permute(permute(ix) + iy);

  vec4 gx = fract(i * (1.0 / 41.0)) * 2.0 - 1.0 ;
  vec4 gy = abs(gx) - 0.5 ;
  vec4 tx = floor(gx + 0.5);
  gx = gx - tx;

  vec2 g00 = vec2(gx.x,gy.x);
  vec2 g10 = vec2(gx.y,gy.y);
  vec2 g01 = vec2(gx.z,gy.z);
  vec2 g11 = vec2(gx.w,gy.w);

  vec4 norm = taylorInvSqrt(vec4(dot(g00, g00), dot(g01, g01), dot(g10, g10), dot(g11, g11)));
  g00 *= norm.x;  
  g01 *= norm.y;  
  g10 *= norm.z;  
  g11 *= norm.w;  

  float n00 = dot(g00, vec2(fx.x, fy.x));
  float n10 = dot(g10, vec2(fx.y, fy.y));
  float n01 = dot(g01, vec2(fx.z, fy.z));
  float n11 = dot(g11, vec2(fx.w, fy.w));

  vec2 fade_xy = fade(Pf.xy);
  vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
  float n_xy = mix(n_x.x, n_x.y, fade_xy.y);
  return 2.3 * n_xy;
}

//
// Description : Array and textureless GLSL 2D simplex noise function.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
// 

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec2 mod289(vec2 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec3 permute(vec3 x) {
  return mod289(((x*34.0)+1.0)*x);
}

float snoise(vec2 v)
  {
  const vec4 C = vec4(0.211324865405187,  // (3.0-sqrt(3.0))/6.0
                      0.366025403784439,  // 0.5*(sqrt(3.0)-1.0)
                     -0.577350269189626,  // -1.0 + 2.0 * C.x
                      0.024390243902439); // 1.0 / 41.0
// First corner
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v -   i + dot(i, C.xx);

// Other corners
  vec2 i1;
  //i1.x = step( x0.y, x0.x ); // x0.x > x0.y ? 1.0 : 0.0
  //i1.y = 1.0 - i1.x;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  // x0 = x0 - 0.0 + 0.0 * C.xx ;
  // x1 = x0 - i1 + 1.0 * C.xx ;
  // x2 = x0 - 1.0 + 2.0 * C.xx ;
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;

// Permutations
  i = mod289(i); // Avoid truncation effects in permutation
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
		+ i.x + vec3(0.0, i1.x, 1.0 ));

  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;

// Gradients: 41 points uniformly over a line, mapped onto a diamond.
// The ring size 17*17 = 289 is close to a multiple of 41 (41*7 = 287)

  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;

// Normalise gradients implicitly by scaling m
// Approximation of: m *= inversesqrt( a0*a0 + h*h );
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );

// Compute final noise value at P
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float snoise(vec3 v)
  { 
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
  }

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
vec3 sinebow(float h) {
	float pi = 1.0 * 3.141595426;
 	h += 0.5;
	h *= -1.0;
	vec3 color;
	color.r = sin(pi * h);
	color.g = sin(pi * (h + 1.0/3.0));
	color.b = sin(pi * (h + 2.0/3.0));
	color *= color;
	return color;
}

vec3 sinehsb(vec3 c) {
	vec4 K = vec4(2.5/3.0, 1.0, 1.0 / 3.0, 3.0);
	vec3 r = sinebow(c.x);
	//r *= c.z;
	r = c.z * mix(K.xxx, r, c.y);
	return r;
}
float smin(float a, float b, float k) {
	float h = clamp(0.5 + 0.5*(b - a)/k, 0.0, 1.0);
	return mix(b, a, h) - k*h*(1.0 - h);
}
float sdPlane(vec3 p) {
	return p.y;
}
float sdSphere(vec3 p, float r) {
	return length(p) - r;
}
float map(vec3 p) {
	float d = sdPlane(p + vec3(0.0, 0.5, 0.0));
	//d = smin(d, sdPlane(p + vec3(0.0, 1.9, 0.0)), 0.5);
	//d = smin(d, length(clamp(p + vec3(-1.0, 0.0, 1.0), 0.0, 0.25)) + 0.2 * snoise(p), 0.5);
	d = smin(d, length(p + vec3(-1.0, -0.25, -1.0)) - mix(0.25, 0.1, clamp(p.x - 0.5, 0.0, 1.0)), 0.5);

	//d = smin(d, -1.0 < p.x && p.x < -0.5 && -0.75 < p.z && p.z < -0.5 ? p.y-0.55 : 100.0, 0.5);
	//d = smin(d, -1.1 < p.x && p.x < -0.9 && -0.75 < p.z && p.z < -0.5 ? p.x + 1.0 : 100.0, 0.5);
	//d = smin(d, -0.6 < p.x && p.x < -0.4 && -0.75 < p.z && p.z < -0.5 ? p.x + 0.4 : 100.0, 0.5);
	//d = smin(d, -1.0 < p.x && p.x < -0.5 && -0.8 < p.z && p.z < -0.7 ? p.z + 0.75 : 100.0, 0.5);
	//d = smin(d, -1.0 < p.x && p.x < -0.5 && -0.6 < p.z && p.z < -0.4 ? p.z + 0.5 : 100.0, 0.5);
	d = smin(d, length(p + vec3(0.7, -0.30, 0.9)) - 0.1, 0.5);
	d = smin(d, length(clamp(p + vec3(0.4, -0.55, 0.62), vec3(-0.0, -0.1, -0.0),vec3(0.5, 0.1,1.3))), 0.1);
	//d = smin(d, p.z + 0.75, 0.5);

	d = smin(d, sdSphere(p + vec3(1.0, 0.0, 0.0), 0.5), 0.1);
	d = smin(d, sdSphere(p, 0.5), clamp(abs(cos(time*0.1)), 0.05, 0.2));
	return d;
}
float rayCast(vec3 ro, vec3 rd, float maxt) {
	float precis = 0.001;
	float h = precis * 2.0;
	float t = 0.0;
	for(int i=0; i<60; i++) {
		if(abs(h) < precis || t > maxt)
			continue;
		h = map(ro + rd*t);
		t += h;
	}
	return t;
}
vec3 calcNormal(vec3 p) {
	vec3 e = vec3(0.001, 0.0, 0.0);
	vec3 nor = vec3(
		map(p + e.xyy) - map(p - e.xyy),
		map(p + e.yxy) - map(p - e.yxy),
		map(p + e.yyx) - map(p - e.yyx));
	return normalize(nor);
}
float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
	float sh = 1.0;
	float t = mint;
	float h = 0.0;
	for(int i=0; i<30; i++) {
		if(t > maxt)
			continue;
		h = map(ro + rd*t);
		t += h;
		sh = min(sh, k*h/t);
	}
	return sh;
}
vec3 rf(vec3 iv, vec3 n) {
	return dot(-iv, n)*n*2.0 + iv;
}
vec3 render(vec3 ro, vec3 rd) {
	vec3 col = vec3(1.0);
	vec3 col2= 0.4 * sinebow(0.2);
	float t = rayCast(ro, rd, 20.0);
	vec3 pos = ro + rd*t;
	vec3 nor = calcNormal(pos);
	vec3 lig = normalize(vec3(0.5, 1.0, 3.5));
	vec3 lig2 = normalize(vec3(1.5, 1.0, 1.0));
	float dif = clamp(dot(lig, nor), 0.0, 1.0);
	float spec = pow(clamp(dot(rf(rd, nor), lig),0.0, 1.0), 16.0);
	float sh = softShadow(pos, lig, 0.02, 20.0, 14.0);
	float dif2 = clamp(dot(lig2, nor), 0.0, 1.0);
	float spec2 =  pow(clamp(dot(rf(rd, nor), lig2),0.0, 0.6), 16.0);
	float sh2 = softShadow(pos, lig2, 0.02, 20.0, 14.0);
	//col = vec3(mod((pos).x * 10.0, 1.0) < 0.05 ? 1.0 : 0.0, mod((pos).y * 11.0, 1.0) < 0.05 ? 1.0 : 0.0, mod((pos).z * 10.0, 1.0) < 0.05 ? 1.0 : 0.0);
	//col = vec3(0.5, mod(t * 20.0, 1.0) < 0.09 ? 1.0 : 0.5, 0.5);
	//col = sinebow(map(ro + rd)* 50.0);
	return col*(dif + spec)*sh + col2*(dif2 + spec2)*sh2;
}

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution.xy)/resolution.y;
	vec3 ro = vec3(-0.5 + 3.2*cos(0.1*time + 6.0*mouse.x), 1.0 + 2.0*mouse.y, 0.5 + 3.2*sin(0.1*time + 6.0*mouse.x));
	vec3 ta = vec3(-0.5, -0.4, 0.5);
	vec3 cw = normalize(ta - ro);
	vec3 cp = normalize(vec3(0.0, 1.0, 0.0));
	vec3 cu = normalize(cross(cw, cp));
	vec3 cv = normalize(cross(cu, cw));
	vec3 rd = normalize(p.x*cu + p.y*cv + 2.5*cw);
	vec3 col = render(ro, rd);
	col = pow(col, vec3(0.4545));
	gl_FragColor = vec4(col, 1.0);
}