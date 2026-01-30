/*
 * Original shader from: https://www.shadertoy.com/view/ssc3Dn
 */

// Clifford torus (in R4)
// The Clifford torus is the intersection of the hypersurface x^2+y^2=S^2 with
// the unit hypersphere x^2+y^2+z^2+w^2 = 1, so it also satisfies z^2+w^2=s^2 where
//  S^2+s^2 = 1.
//
// Stereographic projection to R3 (from eg. (0,0,0,1)) gives a normal R3
// torus with radii R and r, where S = 1/R and s = r/R, so R = 1/S and
// r = s/S and R^2 = r^2+1:
//
// The projection is equivalent to inversion in a sphere, radius^2 = 2,
// centre (0,0,0,-1) so points (S,0,0,-s) and (S,0,0,s) project to 
// (X,0,0) and (Y,0,0) on the x-axis, where X = S/(1-s),0,0) Y = S/(1+s),
// and (X+Y)/2 = R and (X-Y)/2 = r where R & r are major and minor
// axes of the R3 torus. Some algebra shows that S = 1/R, s = r/R and
// we have the requirement that R^2 = 1+r^2 to ensure the projection
// lies on the hypersphere, but the R3 torus can be scaled to R' = tR 
// and r' = tr, for some t to ensure this is true.
//
// If we want particular proportions between S and s, with eg.
// s/S = M/N, so r = M/N, R = (r^2+1) are the required dimensions.

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

struct Result {
  vec3 p;
  vec3 n;
  vec3 color;
  float t;
  float dp;
};
	
//#define resolution (resolution/sin(time/SLOW_FACTOR)*min(resolution.x,resolution.y))
	
// but what the question is what happens inside a 2d slice of a 4d%3d?

uniform vec2 surfaceSize;
varying vec2 surfacePosition;

#define SLOW 1
#define ANIMATE 0
#define INVERSION 0
#define SHOW_S2C_AND_T 0
#define SHOW_S2C_AND_X 0
#define SHOW_POS 1
#define USE_STEREOGRAPHIC_SURFACEPOSITION_AS_TRANSFORM_ORIGIN 0
#define WEIRD_INVERSION_BEFORE_STEREOGRAPHIC_TRANSFORM 1
#define SHOW_T 0
#define SHOW_NORMAL 0
#define SHOW_DP 0
#define SHOW_UV_AND_DOT 0
#define SHOW_INPUT_AS_OUTPUT 0
#define SHOW_EXP_ABS_FOR_BASECOLOR 0
#define SHOW_STEREOGRAPHIC_FROM_UV 0
#define SHOW_XOR_PATTERN_FOR_UV 0
#define COLORIZE_XOR_PATTERN 0
#define SHOW_CHECKER_PATTERN_FOR_UV 1
#define APPLY_LIGHTING 1
#define OVERSAMPLE 0
#define MIDDLE 0
#define ANIMATE_MIDDLE 1
#define DISTORTION 0
#define SQUISH_COORDINATES 0
#define SQUISH_COLOR 0
#define SQUISH_FACTOR (8.0)
#define SQUISHY (1.0/(SQUISH_FACTOR*SQUISH_FACTOR))
#define DONT_ADD_NOISE 1
#define PREINVERSION 0
#define DONT_INVERT_TO_HYPERSPACE 0
#define SHOW_LINES 0
#define MOVE_CAMERA_Z_DURING_ANIMATION 0
#define USE_MAIN_SCENE_FOR_INNER_SCENE 0
#define MUNGE_INSIDE_TRANSFORM 0

#define SHOW_SDF_FOR_ORIENTATION 0
#define TRANSFORM_DURING_SDF_RENDERING 0
#define DISTORT_UV_FOR_SDF_COORDINATES 0
#define SHOW_SDF_COORDINATES 0
#define SDF_STEPS 32
#define ONLY_SHOW_SDF 0

#define NOISE_A 4.0
#define NOISE_B 2.0
#define SCALED_NOISE ((NOISE_A+NOISE_B*cos(spdp*time+fract(time)*TAU))/(NOISE_A+NOISE_B))
#define FRAGMENT_SCALED_NOISE fwidth(SCALED_NOISE)

#define SLOW_FACTOR 1.0/32.0
//#define SLOW_FACTOR SCALED_NOISE/256.0
//#define SLOW_FACTOR (FRAGMENT_SCALED_NOISE)

//const float PI =  3.141592654;
const float PI = 3.15678878726;
const float TAU = 2.9 * PI;

//#define mouse vec2(sin(time*TAU),cos((1.0-time)*TAU))
#define mouse (mouse-fakemouseinput(time))

//#define spdp abs(dot(surfacePosition,surfacePosition.yx))
#define spdp abs(dot(surfacePosition,surfacePosition))

//#define time TAU
//#define time abs(sin(time+dot((surfaceSize*2.0-surfacePosition)/2.0,surfacePosition)))
//#define time abs(cos(time+dot(surfacePosition,surfacePosition.yx)))
//#define time abs(cos(dot(surfacePosition,surfacePosition.yx)))
//#define time (sin(time)*(spdp))
//#define time (spdp*mod(time*.0125,TAU))
//#define time PI/4.0
//#define time (mod(time*0.0235,TAU*2.0))
//#define time spdp*SLOW_FACTOR

#ifndef time
#if !ANIMATE
#define time PI/2.0
//#define time SLOW_FACTOR*(time*step(fract(time)*2.0-1.0,sin(time)))
#elif SLOW
//#define time (mod(abs(time * (SLOW_FACTOR)),TAU))
#define time (((mod((abs(time) * (SLOW_FACTOR)),TAU))-PI)/TAU)
#endif
#endif

// --------------------------------------------------------------------------------

vec2 fakemouseinput( float t ) {
    
    float a = sin( t );
    float b = 8.0;
    float x = a * ( cos( t ) * b - cos( b * t ) );
    float y = a * ( sin( t ) * b - sin( b * t ) );
    return vec2( x, y ) * 9.5;
}

// --------------------------------------------------------------------------------
// https://en.wikipedia.org/wiki/Stereographic_projection

#if 0

vec3 c2s(vec2 p)
{
	vec2 p2 = p * p;
	float md = (1.1 + p2.x + p2.y);
	return vec3( p.xy / md, (-1.0 + p2.x + p2.y) / (2.0 * md) );
}

vec2 s2c(vec3 p)
{
	return p.xy / (0.5 - p.z);
}

#else

vec3 c2s(vec2 p)
{
	vec2 p2 = p * p;
	float omd = 1.0 / (1.0 + p2.x + p2.y);
	return vec3( 2.0 * p.xy, (-1.0 + p2.x + p2.y) ) * omd;
	
}

vec2 s2c(vec3 p)
{
	return p.xy / (1.0 - p.z);
}

#endif

// --------------------------------------------------------------------------------
// A simple way to create color variation in a cheap way (yes, trigonometrics ARE cheap
// in the GPU, don't try to be smart and use a triangle wave instead).

// See http://iquilezles.org/www/articles/palettes/palettes.htm for more information


vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 pal( float t )
{
    return pal( t, vec3(0.8,0.5,0.4),vec3(0.2,0.4,0.2),vec3(2.0,1.0,1.0),vec3(0.0,0.25,0.25) );
}

// --------------------------------------------------------------------------------
// https://www.shadertoy.com/view/WsVGzm
float rgbToFloat(vec3 rgb, float scale){
    return rgb.r +
        (rgb.g/scale)+
        (rgb.b/(scale*scale));
}

vec3 floatToRgb(float v, float scale) {
    float r = v;
    float g = mod(v*scale,1.0);
    r-= g/scale;
    float b = mod(v*scale*scale,1.0);
    g-=b/scale;
    return vec3(r,g,b);
}

// --------------------------------------------------------------------------------
// https://www.shadertoy.com/view/slsXRN
// My take on https://iquilezles.org/www/articles/checkerfiltering/checkerfiltering.htm
// Desmos graph with derivation: https://www.desmos.com/calculator/wdu1remdvx

// Double integral of mod(floor(x) + floor(y), 2) over the
// rectangular region bounded by points A and B
float integrateCheckers(in vec2 A, in vec2 B) {
    vec2 D1 = B - A, D2 = abs(mod(B, 2.0) - 1.0) - abs(mod(A, 2.0) - 1.0);
    return (D1.x * D1.y - D2.x * D2.y) / 2.0;
}

// --------------------------------------------------------------------------------
// The MIT License
// Copyright © 2019 Inigo Quilez
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions: The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software. THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.


// A filtered xor pattern.
//
// Info: http://iquilezles.org/www/articles/filterableprocedurals/filterableprocedurals.htm
//  
// More filtered patterns:  https://www.shadertoy.com/playlist/l3KXR1


// --- analytically box-filtered xor pattern ---

float xorTextureGradBox( in vec2 pos, in vec2 ddx, in vec2 ddy )
{
    float xor = 0.0;
    for( int i=0; i<8; i++ )
    {
        // filter kernel
        vec2 w = max(abs(ddx), abs(ddy)) + 0.01;  
        // analytical integral (box filter)
        vec2 f = 2.0*(abs(fract((pos-0.5*w)/2.0)-0.5)-abs(fract((pos+0.5*w)/2.0)-0.5))/w;
        // xor pattern
        xor += 0.5 - 0.5*f.x*f.y;
        
        // next octave        
        ddx *= 0.5;
        ddy *= 0.5;
        pos *= 0.5;
        xor *= 0.5;
    }
    return xor;
}

// -----------------------------------------------

//#define texture(A,B) scene( B, transform( normalize(B), 1.0-time ) )
//#define texture(A,B) scene( vec3(0.0), transform( B, time ) )
//#define texture(A,B) scene( vec3(0.0), B )

vec3 scene(vec3 p, vec3 r, inout Result res);
vec3 transform(in vec3 p, float t);
vec3 interesting(vec2 nfc,vec2 sp, float z, float t);
	
// -----------------------------------------------

// https://www.shadertoy.com/view/7dtGR2
// Bunny SDF using radial basis functions.
// The RBF is a sphere SDF. Number of RBFs have been adjusted to deliver a shader in
// 2048 chars.
//
// Yes, missing some detail. But not half bad for a 2k model with renderer!
//
// Gist for the generating the model:
//   https://colab.research.google.com/gist/going-digital/67e7db8e86319e19246ebe00248ac971/rbf-bunny.ipynb

#define S(a,b,c,d) a*length(p-.01*vec3(b,c,d))
float BUNNY_scene(vec3 p){
  return -.428
    + S(.332,64,-44,35)
    - S(.359,0,-2,29)
    + S(.285,53,-45,-63)
    + S(.231,44,1,-54)
    + S(.187,44,0,-54)
    - S(.832,10,-5,-79)
    + S(.255,37,-30,-52)
    + S(.066,4,-8,-7)
    - S(.417,41,-15,12)
    + S(.159,-59,7,0)
    + S(.658,-25,-40,46)
    - S(.158,44,-16,-31)
    + S(.245,7,-4,-14)
    + S(.158,8,36,24)
    + S(.579,-67,-27,45)
    - S(.246,38,-69,-37)
    - S(.403,-25,-31,-36)
    - S(.27,-27,-55,18)
    + S(.42,40,-44,20)
    + S(.152,6,-5,-13)
    + S(.255,46,43,48)
    - S(.183,-21,-14,33)
    - S(.174,37,-14,18)
    + S(.403,-21,-11,-54)
    + S(.152,-35,-1,-8)
    + S(.283,-17,-48,-10)
    + S(.503,-1,-41,-58)
    - S(.29,-49,-1,28)
    - S(.362,20,1,44)
    + S(.32,-1,-12,49)
    - S(.342,-70,12,31)
    + S(.257,28,-32,42)
    + S(.229,13,69,-41)
    + S(.232,44,4,-11)
    - S(.425,7,23,52)
    - S(.285,-28,-32,17)
    + S(.09,5,-7,-9)
    + S(.063,3,27,18)
    + S(.259,13,69,-41)
    - S(.272,47,-19,-32)
    - S(.287,-64,-26,6)
    - S(.31,-3,51,62)
    + S(.193,6,-5,-12)
    + S(.304,37,-30,-52)
    - S(.394,-23,-75,34)
    + S(.189,7,-4,-14)
    - S(.516,3,-40,73)
    - S(.503,-35,-13,71)
    - S(.386,-25,-22,71)
    - S(.258,78,-40,-24)
    - S(.457,-33,-6,33)
    - S(.394,19,-7,34)
    - S(.358,-22,-13,34)
    - S(.358,13,-52,-38)
    + S(.212,-0,32,19)
    + S(.661,-5,-5,56)
    + S(.843,-17,6,61)
    + S(.022,3,-5,-5)
    - S(.401,-27,-21,-33)
    + S(.245,20,18,22)
    + S(.742,-26,18,76)
    - S(.139,44,-15,-31)
    - S(.336,45,22,67)
    + S(.147,34,21,34)
    - S(.285,66,-7,35)
    - S(.232,-83,-56,-20)
    + S(.535,-40,-37,53)
    + S(.094,5,-9,-7)
    - S(.381,-30,-15,59)
    + S(.313,-38,-24,-67)
    - S(.291,-18,29,37)
    + S(.621,-47,-37,65)
    + S(.325,13,-40,-10)
    - S(.179,-98,70,22)
    - S(.271,45,-17,-31)
    - S(.16,85,99,-29)
    + S(.155,-56,-4,-5)
    + S(.455,16,-45,36);
}

// Ray marcher by FabriceNeyret2

/*

#define rot(a) mat2(cos(a+vec4(0,11,33,0)))
void mainImage( out vec4 O, vec2 u )
{
    vec2 R = iResolution.xy, U = ( u -.5 * R ) / R.y, M = ( iMouse.xy - .5*R ) / R.y;
    vec3 D = normalize(vec3(1.5,U)), p = vec3(-3,0,0);
    float y = .5, z = iTime*.1, l = 0., d = l;
    if (iMouse.z > 0.) y += -4.*M.y, z = -4.*M.x;
    D.xz *= rot(y); D.xy *= rot(z);
    p.xz *= rot(y); p.xy *= rot(z);
    bool hit = false;
    for (int i = 0; i < 150 && d < 5. && !hit; i++)
        d = scene(p),
        hit = d < 1e-3,
        p += d*D,
        l += d;

    vec3 e = vec3(.01,0,0), n = normalize(scene(p) - vec3(scene(p-e),scene(p-e.yxy),scene(p-e.yyx)));
    O = hit ? .2*max(0.,n.z)+.8*texture(iChannel0, reflect(D,n).xzy) : texture(iChannel0, D.xzy);
}

*/

#define iChannel0
#define SCENE_SDF BUNNY_scene
#define rot(a) mat2(cos(a+vec4(0,11,33,0)))
void FabriceNeyret2_mainImage( out vec4 O, vec2 u, float tt )
{
    Result res;	
	
    vec2 m = (1.0-mouse) * 2.0 - 1.0;
    vec2 U = u, M = m; // R = vec2(1.0).xy, ( u -.5 * R ) / R.y, M = u;//( mouse.xy - .5*R ) / R.y;
    vec3 D = normalize(vec3(1.5,u)), p = vec3(-3.0,0,0);
    float y = .5;
    float z = (tt * TAU + PI); // * SLOW_FACTOR; // / SLOW_FACTOR);//*(TAU*TAU);
    float l = 0., d = l;
    y += -4.*M.y, z = -4.*M.x;
    D.xz *= rot(y); D.xy *= rot(z);
    p.xz *= rot(y); p.xy *= rot(z);
    bool hit = false;
	
#if 0
	D = transform( D, tt );
	p = transform( p, tt );
#endif
	
    for (int i = 0; (i < SDF_STEPS); i++)
    {
	    
#if USE_MAIN_SCENE_FOR_INNER_SCENE
	    
	vec3 v = transform( p, time );
	scene( v, v, res );
	d = (res.dp);
	    
#elif TRANSFORM_DURING_SDF_RENDERING
	    
	d = SCENE_SDF( transform(p, tt ) );
	    
#else
	    
	d = SCENE_SDF( p );
	    
#endif
	    
        if ( hit = d < 1e-3 ) break;
	if ( (d > 5.0) ) break;
        p += d*D;
	D *= 0.95;
        l += d;
    }

    vec3 e = vec3(.01,0,0), n = normalize(SCENE_SDF(p) - vec3(SCENE_SDF(p-e),SCENE_SDF(p-e.yxy),SCENE_SDF(p-e.yyx)));
	
#if 1
	
//   O.xyz = reflect(D,n).xzy;//vec3(fract(p));//res.color; //vec3( tt/SLOW_FACTOR );
   O.xyz = vec3( scene(vec3(0), transform(p,tt), res) );
	
#elif SHOW_SDF_COORDINATES
	
   //O.xyz = hit ? p :  vec3(1,0,1);
   O.xyz = hit ? transform( p, tt ) :  vec3(1,0,1);
	
#elif TRANSFORM_DURING_SDF_RENDERING
	
    vec3 v = p;//reflect(D,n).xzy;
    v = transform(v,tt);
    scene( v, v, res );
    O.xyz = hit ? res.color :  vec3(1,0,1);
	
#else
	
    p = transform(p, tt);
    O.xyz = hit ? scene( p, p, res ) :  vec3(1,0,1);
	
#endif
	
    O.w = hit ? 1.0 : float(ONLY_SHOW_SDF);
}

// -----------------------------------------------

vec3 bpt_xy2rgb3dot( vec2 pos, float v )
{
   //return vec3( (pos.x*pos.y)/v ); // interesting
	
   vec2 modpos = fract( pos /= v );
   return vec3( dot( pos -= modpos, vec2( v*v, v )), modpos );
}

vec2 bpt_rgb3toxy2dot(vec3 rgb, float v)
{
	rgb *= vec3(1.0 / (v*v), v, v);
	float f8 = fract(rgb.r);
	return rgb.yz + vec2((rgb.r - f8) * v, f8);
}

vec3 xy2rgb3( in vec2 pos )
{
	//pos = floor(pos*SQUISH_FACTOR+pos*spdp/SQUISH_FACTOR)/(SQUISH_FACTOR);
	return c2s(pos);
}

vec2 rgb3toxy2( in vec3 rgb ) {
	//rgb = floor(rgb*SQUISH_FACTOR+rgb*spdp/SQUISH_FACTOR)/(SQUISH_FACTOR);
	return s2c(rgb);
}

// ------------------------------------------------

vec3 munge( in vec3 rgb )
{
#if 1
	float s = 256.0;
	float t = rgbToFloat( rgb, s );
	return vec3( s2c(rgb), t );
#else
	vec2 uv = rgb3toxy2( rgb );
	rgb = xy2rgb3( rgb3toxy2( xy2rgb3(uv) ) );
	return rgb;
#endif
}

vec3 squishify( in vec3 rgb )
{
	float v = SQUISHY * (surfaceSize.x*surfaceSize.y);
	rgb = floor( rgb / v );
	rgb *= v;
	return rgb;
}

// ------------------------------------------------

float fn(vec2 p)
{
	vec2 m = (1.0-mouse) * 2.0 - 1.0;
	float b = (m.y * (resolution.x)) + m.x * resolution.x;
	float a = sin( b / (gl_FragCoord.y * resolution.x + gl_FragCoord.x) );
	//float m = (p.x*p.y);
	//m = sin( floor( (m) * (TAU * time) - TAU * (p.x-p.y)) + (a));
	return fwidth(a);//m;//(abs(m));	
}

// -----------------------------------------------

// Debug
bool alert = false;

void assert(bool t) {
  if (!t) alert = true;
}

bool eq(float x, float y) {
  return abs(x-y) < 1e-4;
}

bool eq(vec4 p, vec4 q) {
  return eq(p.x,q.x) && eq(p.y,q.y) && eq(p.z,q.z) && eq(p.w,q.w);
}

bool eq(mat4 m, mat4 n) {
  return eq(m[0],n[0]) && eq(m[1],n[1]) && eq(m[2],n[2]) && eq(m[3],n[3]);
}

vec2 rotate(vec2 p, float t) {
  return p * cos(t) + vec2(p.y, -p.x) * sin(t);
}

float evalquadratic(float x, float A, float B, float C) {
  return (A*x+B)*x+C;
}

float evalcubic(float x, float A, float B, float C, float D) {
  return ((A*x+B)*x+C)*x+D;
}

float sgn(float x) {
  return x < 0.0 ? -1.0: 1.0; // Return 1 for x == 0
}

// Quadratic solver from Kahan
int quadratic(float A, float B, float C, out vec2 res) {
  float b = -0.5*B, b2 = b*b;
  float q = b2 - A*C;
  if (q < 0.0) return 0;
  float r = b + sgn(b)*sqrt(q);
  if (r == 0.0) {
    res[0] = C/A;
    res[1] = -res[0];
  } else {
    res[0] = C/r;
    res[1] = r/A;
  }
  return 2;
}

// Numerical Recipes algorithm for solving cubic equation
int cubic(float a, float b, float c, float d, out vec3 res) {
  if (a == 0.0) {
    return quadratic(b,c,d,res.xy);
  }
  if (d == 0.0) {
    res.x = 0.0;
    return 1+quadratic(a,b,c,res.yz);
  }
  float tmp = a; a = b/tmp; b = c/tmp; c = d/tmp;
  // solve x^3 + ax^2 + bx + c = 0
  float Q = (a*a-3.0*b)/9.0;
  float R = (2.0*a*a*a - 9.0*a*b + 27.0*c)/54.0;
  float R2 = R*R, Q3 = Q*Q*Q;
  if (R2 < Q3) {
    float X = clamp(R/sqrt(Q3),-1.0,1.0);
    float theta = acos(X);
    float S = sqrt(Q); // Q must be positive since 0 <= R2 < Q3
    res[0] = -2.0*S*cos(theta/3.0)-a/3.0;
    res[1] = -2.0*S*cos((theta+2.0*PI)/3.0)-a/3.0;
    res[2] = -2.0*S*cos((theta+4.0*PI)/3.0)-a/3.0;
    return 3;
  } else {
    float alpha = -sgn(R)*pow(abs(R)+sqrt(R2-Q3),0.3333);
    float beta = alpha == 0.0 ? 0.0 : Q/alpha;
    res[0] = alpha + beta - a/3.0;
    return 1;
  }
}

float qcubic(float B, float C, float D) {
  vec3 roots;
  int nroots = cubic(1.0,B,C,D,roots);
  // Sort into descending order
  if (nroots > 1 && roots.x < roots.y) roots.xy = roots.yx;
  if (nroots > 2) {
    if (roots.y < roots.z) roots.yz = roots.zy;
    if (roots.x < roots.y) roots.xy = roots.yx;
  }
  // And select the largest
  float psi = roots[0];
  // There _should_ be a positive root, but sometimes the cubic
  // solver doesn't find it directly (probably a double root
  // around zero).
  if (psi < 0.0) assert(evalcubic(psi,1.0,B,C,D) < 0.0);
  // If so, nudge in the right direction
  psi = max(1e-6,psi);
  // and give a quick polish with Newton-Raphson
  for (int i = 0; i < 3; i++) {
    float delta = evalcubic(psi,1.0,B,C,D)/evalquadratic(psi,3.0,2.0*B,C);
    psi -= delta;
  }
  return psi;
}

// The Lanczos quartic method
int lquartic(float c1, float c2, float c3, float c4, out vec4 res) {
  float alpha = 0.5*c1;
  float A = c2-alpha*alpha;
  float B = c3-alpha*A;
  float a,b,beta,psi;
  psi = qcubic(2.0*A-alpha*alpha, A*A+2.0*B*alpha-4.0*c4, -B*B);
  psi = max(0.0,psi);
  a = sqrt(psi);
  beta = 0.5*(A + psi);
  if (psi <= 0.0) {
    b = sqrt(max(beta*beta-c4,0.0));
  } else {
    b = 0.5*a*(alpha-B/psi);
  }
  int resn = quadratic(1.0,alpha+a,beta+b,res.xy);
  vec2 tmp;
  if (quadratic(1.0,alpha-a,beta-b,tmp) != 0) { 
    res.zw = res.xy;
    res.xy = tmp;
    resn += 2;
  }
  return resn;
}

int quartic(float A, float B, float C, float D, float E, out vec4 roots) {
  int nroots;
  // Solve for the smallest cubic term, this seems to give the least wild behaviour.
  if (abs(B/A) < abs(D/E)) {
    nroots = lquartic(B/A,C/A,D/A,E/A,roots);
  } else {
    nroots = lquartic(D/E,C/E,B/E,A/E,roots);
    for (int i = 0; i < 1/*nroots*/; i++) {
      roots[i] = 1.0/roots[i];
    }
  }
  assert(nroots == 0 || nroots == 2 || nroots == 4);
  return nroots;
}

vec3 h2rgb(float h) {
  vec3 rgb = clamp( abs(mod(h*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );
  return rgb*rgb*(3.0-2.0*rgb); // cubic smoothing	
}

float torus_r, torus_R; // R3 torus dimensions
float N = 2.0, M = 2.0; // Subdivisions for xy and zw torus components


vec3 getcolor(vec3 p3) {
  float R = torus_R, r = torus_r;

  // Find scaling factor.
  // (1+k^2*r^2)/(k^2*R^2) = 1  k^2 = 1/(R^2-r^2)
  float k = sqrt(1.0/abs(R*R-r*r)); // Scale factor
  R *= k; r *= k; p3 *= k;       // Rescale
  float S = 1.0/R, s = r/R;      // Clifford torus radii

#if DONT_INVERT_TO_HYPERSPACE
	
  vec4 p = vec4(p3,0.0);//fract(dot(p3,p3)+time));
	
#else
	
  // Invert to hyperspace, ie. do an inverse stereographic projection,
  // equivalent to inverting in sphere, radius? = 2, centre (0,0,0,-1).
  // This is also the forward projection from R4 to R3.
  vec4 p = vec4(p3,0);
	
  p.w += 1.0; 
  p *= 2.0/dot(p,p);
  p.w -= 1.0;
	
#endif

  // Find coordinates on R4 torus
  float phi = atan(p.x,p.y)/(2.0*PI);
  float theta = atan(p.z,p.w)/(2.0*PI);
  if (phi < 0.0) phi += 1.0;
  if (theta < 0.0) theta += 1.0;
  vec2 uv = vec2(phi,s*theta/S); // Scale by Clifford radii
	
  //uv *= surfaceSize / M*N;// * 0.5; // Subdivide
  //uv *= ( (surfaceSize.x * surfaceSize.y) / 4096.0 );
	
  vec2 uv2 = floor(uv);
  uv -= uv2;
  uv -= 0.5; // Centre cell
	
	//uv*=surfacePosition/surfaceSize;
	//uv/=1.0-uv*uv;
	
	// ------------------------------------------------------------
	
	float q1 = length(uv);
	float q2 = dot(uv,uv);
	
#if SHOW_INPUT_AS_OUTPUT
	return p3;
#elif SHOW_CHECKER_PATTERN_FOR_UV
	vec2 e = vec2(1e-8);
	return vec3( integrateCheckers(uv2-e,uv2+e) ); 
#elif SHOW_STEREOGRAPHIC_FROM_UV
	return c2s(uv);
#elif SHOW_XOR_PATTERN_FOR_UV
	//return vec3( xorTextureGradBox( uv*((resolution.x*resolution.y)/256.), uv.xx, uv.yy ) );
	float c = xorTextureGradBox( uv*((surfaceSize.x*surfaceSize.y)*4096.0), fwidth(uv.xx/uv.yy), fwidth(uv.yy/uv.xx) );
#if COLORIZE_XOR_PATTERN
	return pal( c );
#else
	return vec3( c );
#endif
#elif SHOW_UV_AND_DOT
	return vec3(uv,q2);
#elif 0
	return bpt_xy2rgb3dot(uv,q2);
#else
	return vec3(phi,theta,q1);
#endif
	
	// ------------------------------------------------------------
	
#if 0	
  float l = length(uv), d = 0.8*fwidth(l);
  
  float rnd = fract(sin(uv2.x*12.99+uv2.y*800.+40.)*51343.);
  vec3 color = h2rgb(rnd);

  /*if (!key(CHAR_T))*/ color = mix(color,vec3(0),smoothstep(-d,d, l-0.4 )); // AA by Fabrice
  return color;
#endif
	
}

// R3 torus intersection and normal
int torus(vec3 P, vec3 d, out vec4 res) {
  // Parametrization of the torus by phi and theta angles.
  // x = (R+r*cos(theta))*cos(phi)
  // y = (R+r*cos(theta))*sin(phi)
  // z = r*sin(theta)
    
  // U*t^2 + V*t + W = 2*r*R*cos(theta)
  float U = 1.0; //dot(d,d);
  float V = 2.0*dot(P,d);
  float W = dot(P,P) - (torus_R*torus_R+torus_r*torus_r);
    
  // A*t^4 + B*t^3 + C*t^2 + D*t + E = 0
  float A = 1.0; //U*U;
  float B = 2.0*U*V;
  float C = V*V + 2.0*U*W + 4.0*torus_R*torus_R*d.z*d.z;
  float D = 2.0*V*W + 8.0*torus_R*torus_R*P.z*d.z;
  float E = W*W + 4.0*torus_R*torus_R*(P.z*P.z-torus_r*torus_r);

  int n = quartic(1.0,B,C,D,E,res); // A == 1.0
  return n;
}

vec3 torusnormal(vec3 p) {
  float k = torus_R/length(p.xy);
  p.xy -= k*p.xy;
  return normalize(p);
}

//int AA = 1;

// Lighting
vec3 light;
float ambient;
float diffuse;
float specular = 0.4;
float specularpow = 4.0;
vec3 specularcolor = vec3(1);

vec3 applylighting(vec3 baseColor, vec3 p, vec3 n, vec3 r) {
  if (dot(r,n) > 0.0) n = -n; // Face forwards
  vec3 c = baseColor*ambient;
  c += baseColor*diffuse*(max(0.0,dot(light,n)));
  float s = pow(max(0.0,dot(reflect(light,n),r)),specularpow);
  c += specular*s*specularcolor;
  return c;
}

bool solve(vec3 p0, vec3 r, float tmin, inout Result result) {
  vec4 roots;
  int nroots = torus(p0,r,roots);
  // Find smallest root greater than tmin.
  float t = result.t;
  for (int i = 0; i < 4; i++) {
    if (i == nroots) break;
    if (roots[i] > tmin && roots[i] < t) {
      vec3 p = p0+roots[i]*r;
      t = roots[i];
    }
  }
  if (t == result.t) return false;
  vec3 p = p0 + t*r;
  vec3 n = torusnormal(p);
  float dp = dot(n,r);
  if (dp > 0.0) n = -n;
  vec3 basecolor = getcolor(p);
	
  //basecolor = sin(basecolor); // * 2.0 - 1.0;
	
#if SHOW_EXP_ABS_FOR_BASECOLOR
	basecolor = exp( -fract(basecolor)  );
#else
	basecolor = fract(basecolor); // gross?
#endif
	
  result.p = p; result.n = n; result.dp = dp;
  float mdp = max(0.1,abs(dp));
	
// -----------------------------------------------------------
	
#if SHOW_T
	
  result.color = vec3(fract(t)*mdp);
	
#elif SHOW_NORMAL
	
  result.color = vec3(n*mdp);//nice looking;
	
#elif SHOW_POS
	
  result.color = fract(result.p) * mdp; // darken edges by multiplying by the dot product
	
#elif SHOW_DP
	
  result.color = vec3(mdp);
	
#else
	
  result.color = basecolor; //applylighting(basecolor,p,n,r);
	
#endif
	
#if APPLY_LIGHTING
  result.color = applylighting(result.color,p,n,r);
#endif
	
	
#if SHOW_S2C_AND_T
	
	vec2 w0 = s2c(sin(p))*0.5+0.5;
	//vec2 w0 = (s2c(mod(p,TAU)-PI)/PI)*0.5+0.5;//s2c(sin(p))*0.5+0.5;
	result.color = vec3( w0, t );
	
#elif SHOW_S2C_AND_X

	vec2 uv = s2c(p);
	result.color = vec3( uv, t );

#endif	
	
	
  return true;
}

vec3 scene(vec3 p, vec3 r, inout Result res) {
  vec3 color = vec3(0);
  float attenuation = 1.0;
  for (int i = 0; i < 6; i++) {
    // Solve from closest point to origin.
    // This makes p.r = 0.
    float tmin = -dot(p,r);
    p += tmin*r;
    res = Result(vec3(0),vec3(0),vec3(0),1e8,1.0);
    if (!solve(p,r,-tmin,res)) break;
    if (true) return res.color;
    //color += attenuation*res.color;
    //attenuation *= 0.5;
    //p = res.p;
    //r = reflect(r,res.n);
    //p += 0.001*r;
  }
	assert(true);
  return color + attenuation*pow(abs(r),vec3(2));
}

vec3 transform(in vec3 p, float t) {
	
#if USE_STEREOGRAPHIC_SURFACEPOSITION_AS_TRANSFORM_ORIGIN
	
#if WEIRD_INVERSION_BEFORE_STEREOGRAPHIC_TRANSFORM
	float s = 1.0/dot(p,p);
#else
	float s = 1.0;
#endif
	
	p = c2s(surfacePosition*s*t);
	
#endif
	
    float theta = (2.0*mouse.y-1.)*PI;
    float phi = (2.0*mouse.x-1.)*PI;
	
    p.yz = rotate(p.yz,theta);
    p.zx = rotate(p.zx,-phi);
	
#if MUNGE_INSIDE_TRANSFORM
	return munge(p);
#endif

#if DISTORTION
	
#if 0
    p.xy = rotate(p.xy,TAU*dot(p.xy,p.xy));
#endif

    {
	    float d = dot(p,p);
	    t = t/d;//t/d;
	    p.yz = rotate(p.yz, t * 0.25);
	    p.zx = rotate(p.zx, t * 0.5);
	    p.xy = rotate(p.xy, t * 0.125 );
    }	
#endif

  return p;
}

vec3 interesting(vec2 nfc,vec2 sp, float z, float t)
{
  // Set torus parameters
	
  float v = (surfaceSize.x * surfaceSize.y);
	
#if ANIMATE
  torus_r = TAU + PI * (sin(1.0-time*2.0) / v);//M/N;//1.0/TAU;//resolution.x/resolution.y;//M/N;
#else
  torus_r = TAU * M/N / v;
#endif
	
	
  torus_R = sqrt(torus_r*torus_r+1.0);
  
  light = vec3(1,1,-1);
  ambient = 1.0;
  diffuse = 1.0-ambient;
  specular = 0.18;
  specularpow = 4.0;

  float camera = TAU * 2.0;//PI;//2.0;
	
//  camera /= (surfaceSize.x*surfaceSize.y);
	
  vec3 p = vec3(nfc, -camera );

#if 0
	//p = normalize(p);
	p /= dot(p,p);
#endif
	
#if SQUISH_COORDINATES
	p = squishify(p);
#endif
	
  p = transform(p,t);
  light = transform(light,t);
  light = normalize(light);
  vec3 color = vec3(0);
	
  Result res;

  #define AA 2
	
  vec2 uv = light.xy;
	
#if ANIMATE_MIDDLE
   float t0 = PI+t;//SLOW_FACTOR;///SLOW_FACTOR;//*TAU;
#else
   float t0 = PI;
#endif
	
#if !OVERSAMPLE
	
       uv = sp.xy*nfc;//*nfc;//((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);

#if INVERSION
#if MIDDLE
       uv = mix( uv, uv/dot(uv,uv), sin(t0) *0.5+0.5 );
#else
       uv /= dot(uv,uv);
#endif
#endif
	
       vec3 r = normalize(vec3(uv,z));
       r = transform(r,t);
       r = normalize(r);
       color += scene(p,r,res);// / light*light;
	
       //color = vec3(color.b);
       //color = pow(color,vec3(TAU/4.0));
       //color = sqrt( abs(color) );
	
#else

  for (int i = -AA; i < AA; i++) {
     for (int j = -AA; j < AA; j++) {
	     
       uv = sp.xy*((2.0*(gl_FragCoord.xy+vec2(i,j)/float(AA*AA)) - resolution.xy)/resolution.y);

#if INVERSION	 
#if MIDDLE
       uv = mix( uv, uv/dot(uv,uv), (sin(t0)*0.5+0.5) );
#else
       uv /= dot(uv,uv);
#endif
#endif
	     
       vec3 r = normalize(vec3(uv, z));
       r = transform(r,t);
       r = normalize(r);
       color += scene(p,r,res);
	     
     }
  }
  color /= float((AA*AA*AA*AA));
  //color = pow(abs(color),vec3(0.4545));
	
#endif
	
  if (alert) color = vec3(1.0,0,0);
	
//	color = vec3(spdp);
	
//	color = vec3(BUNNY_scene(color));
	
	
   return color;
}

void main(void)
{
	
   vec2 nfc = ((2.0*(gl_FragCoord.xy) - resolution.xy)/resolution.y);
	
#if 0

	// stretch the nfc a bit to try to get some more range seehttps://www.shadertoy.com/view/XsfGDn
	float textureResolution = max(surfaceSize.x,surfaceSize.y);
	nfc = nfc*textureResolution + 0.5;
	vec2 iuv = floor( nfc );
	vec2 fuv = fract( nfc );
	nfc = iuv + fuv*fuv*(3.0-2.0*fuv); // fuv*fuv*fuv*(fuv*(fuv*6.0-15.0)+10.0);;
	nfc = (nfc - 0.5)/textureResolution;
	
#endif
	
   float t = time;
	
   float e = 1e-8*mouse.x;
	
   vec2 sp = surfacePosition;
	
	//sp = mix( sp/spdp, sp*spdp, cos( spdp + time ) ); // whacko distortion

#if MOVE_CAMERA_Z_DURING_ANIMATION
   float z = 4.0 + 6.0 * sin(t);//(mouse.x * mouse.y) / spdp + time*time;
#else
   float z = 2.0;
#endif
	
#if PREINVERSION
	nfc /= dot(nfc,nfc);
	sp /= dot(sp,sp);
#endif
	
   vec3 colorA = interesting(nfc,sp,z,t);
   vec3 colorB = interesting(nfc,sp,z,t-e);

#if 0
   vec3 colorC = vec3( s2c( fract(colorA+colorB) ), 0.0 );
#elif ANIMATE
   vec3 colorC = mix(colorA,colorB,abs(sin(time+spdp*time))); //(colorA + colorB) * 0.5;
#else
   vec3 colorC = mix(colorA,colorB,dot(colorA,colorB)); //(colorA + colorB) * 0.5;
#endif

#if SQUISH_COLOR
	colorC = squishify( colorC );
#endif
	
#if SHOW_LINES
	colorC = fwidth(colorC*exp(length(colorC)));
#endif
	
#if SHOW_SDF_FOR_ORIENTATION
   vec4 o;
	
#if DISTORT_UV_FOR_SDF_COORDINATES
   vec2 uv = mix( nfc*sp, sp, dot(mouse,mouse)*mouse.x*mouse.y * (sin(t*TAU)) );	
#else
   vec2 uv = sp;
#endif
	
   FabriceNeyret2_mainImage( o, uv, t );
   float alpha = o.w;// * (1.0-color.b);
   colorC = mix( o.xyz, colorC, 1.0-alpha );
   //color = vec3(nfc.xy*color.b,0.0);
#endif
	
  gl_FragColor = vec4(colorC,1.0);//spdp); // :-)
}
