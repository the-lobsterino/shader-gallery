/*
 * Original shader from: https://www.shadertoy.com/view/NdyBRd
 */

#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution

// Emulate some GLSL ES 3.x
#define round(x) (floor((x) + 0.5))

// --------[ Original ShaderToy begins here ]---------- //
// CC0: Weird sunday shader
// I saw some pretty neat logo art and tried to recreate my old (1993) hacker handle (Lance) in that style
// Kind of succeeded but then it was much more fun distorting the coordinate system
// Thought it looks kind of neat so sharing it.


// 0.45 looks neat too
#define COLORTUNE   0.0


#define TIME        iTime
#define TTIME       (TAU*TIME)
#define RESOLUTION  iResolution
#define PI          3.141592654
#define TAU         (2.0*PI)
#define SCA(a)      vec2(sin(a), cos(a))

#define ROT(a)      mat2(cos(a), sin(a), -sin(a), cos(a))

const float df_size = 0.2;
const float df_linew = 0.04*df_size;

// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
const vec4 hsv2rgb_K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
vec3 hsv2rgb(vec3 c) {
  vec3 p = abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www);
  return c.z * mix(hsv2rgb_K.xxx, clamp(p - hsv2rgb_K.xxx, 0.0, 1.0), c.y);
}
// License: WTFPL, author: sam hocevar, found: https://stackoverflow.com/a/17897228/418488
//  Macro version of above to enable compile-time constants
#define HSV2RGB(c)  (c.z * mix(hsv2rgb_K.xxx, clamp(abs(fract(c.xxx + hsv2rgb_K.xyz) * 6.0 - hsv2rgb_K.www) - hsv2rgb_K.xxx, 0.0, 1.0), c.y))

// License: Unknown, author: nmz (twitter: @stormoid), found: https://www.shadertoy.com/view/NdfyRM
vec3 sRGB(vec3 t) {
  return mix(1.055*pow(t, vec3(1./2.4)) - 0.055, 12.92*t, step(t, vec3(0.0031308)));
}

// License: Unknown, author: Matt Taylor (https://github.com/64), found: https://64.github.io/tonemapping/
vec3 aces_approx(vec3 v) {
  v = max(v, 0.0);
  v *= 0.6;
  float a = 2.51;
  float b = 0.03;
  float c = 2.43;
  float d = 0.59;
  float e = 0.14;
  return clamp((v*(a*v+b))/(v*(c*v+d)+e), 0.0, 1.0);
}

// License: Unknown, author: Unknown, found: don't remember
float tanh_approx(float x) {
  //  Found this somewhere on the interwebs
  //  return tanh(x);
  float x2 = x*x;
  return clamp(x*(27.0 + x2)/(27.0+9.0*x2), -1.0, 1.0);
}

// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float arc(vec2 p, vec2 sc, float ra, float rb) {
  p.x = abs(p.x);
  return ((sc.y*p.x>sc.x*p.y) ? length(p-sc*ra) : 
                                abs(length(p)-ra)) - rb;
}

float segmentx(vec2 p, float l) {
  p.x = abs(p.x);
  p.x -= 0.5*l;
  float d0 = abs(p.y);
  float d1 = length(p);
  float d = p.x > 0.0 ? d1 : d0;
  return d;
}

// License: MIT, author: Inigo Quilez, found: https://iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm
float hexagon(vec2 p, float r) {
  const vec3 k = 0.5*vec3(-sqrt(3.0), 1.0, sqrt(4.0/3.0));
  p = abs(p);
  p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
  p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
  return length(p)*sign(p.y);
}

vec2 toSmith(vec2 p)  {
  // z = (p + 1)/(-p + 1)
  // (x,y) = ((1+x)*(1-x)-y*y,2y)/((1-x)*(1-x) + y*y)
  float d = (1.0 - p.x)*(1.0 - p.x) + p.y*p.y;
  float x = (1.0 + p.x)*(1.0 - p.x) - p.y*p.y;
  float y = 2.0*p.y;
  return vec2(x,y)/d;
}

vec2 fromSmith(vec2 p)  {
  // z = (p - 1)/(p + 1)
  // (x,y) = ((x+1)*(x-1)+y*y,2y)/((x+1)*(x+1) + y*y)
  float d = (p.x + 1.0)*(p.x + 1.0) + p.y*p.y;
  float x = (p.x + 1.0)*(p.x - 1.0) + p.y*p.y;
  float y = 2.0*p.y;
  return vec2(x,y)/d;
}

float df_fork(vec2 p) {
  const vec2 n = SCA(-PI/12.0);
  p.x = abs(p.x);
  p -= n*min(0.0, dot(p, n))*2.0;
  return abs(p.x);
}

float df_l(vec2 p) {
  vec2 p0 = p;
  p0.x -= -df_size*sqrt(2.0/3.0);
  p0 = p0.yx;
  float d0 = segmentx(p0, df_size*2.0);
  
  vec2 p1 = p;
  p1.y -= -df_size;
  float d1 = segmentx(p1, df_size*sqrt(8.0/3.0));
  
  float d = d0;
  d = min(d, d1);
  
  return d-df_linew;
}

float df_a(vec2 p) {
  const float sc = sqrt(43.0/24.0);
  const vec2 n = SCA(-PI/6.0);
  p.y -= -df_size*sqrt(11.0/96.0);

  vec2 p0 = p;
  p0.x = abs(p0.x);
  p0 -= n*min(0.0, dot(p0, n))*2.0;
  float d0 = df_fork(p0-vec2(0.0, sc*df_size));

  vec2 p1 = p;
  float d1 = segmentx(p1, sqrt(4.0/3.0)*sc*df_size);
  float d = d0;
  d = min(d, d1);
  return d-df_linew;
}

float df_n(vec2 p) {
  vec2 p0 = p;
  p0.x = abs(p0.x);
  p0.x -= df_size*sqrt(2.0/3.0);
  p0 = p0.yx;
  float d0 = segmentx(p0, df_size*2.0);
  
  vec2 p1 = p;
  p1 *= ROT(-PI/4.0);
  float d1 = segmentx(p1, df_size*2.0);
  
  float d = d0;
  d = min(d, d1);
  
  return d-df_linew;
}

float df_c(vec2 p) {
  p = -p.yx;
  return arc(p, SCA(5.0*PI/6.0), df_size, df_linew);
  
}

float df_e(vec2 p) {
  vec2 p0 = p;
  p0.x -= -df_size*sqrt(2.0/3.0);
  p0 = p0.yx;
  float d0 = segmentx(p0, df_size*2.0);
  
  vec2 p1 = p;
  p1.y = abs(p1.y);
  p1.y -= df_size;
  float d1 = segmentx(p1, df_size*sqrt(8.0/3.0));
  
  vec2 p2 = p;
  float d2 = segmentx(p2, df_size);
  
  float d = d0;
  d = min(d, d1);
  d = min(d, d2);
  
  return d-df_linew;
}

vec3 df(vec2 p) {
  vec2 op = p;
  p.y -= df_size*sqrt(11.0/96.0);

  const float sz = df_size*2.4;
  p.x -= sz;
  vec2 pl = p;
  pl.x -= -2.0*sz;
  float dl = df_l(pl);

  vec2 pa = p;
  pa.x -= -1.0*sz;
  float da = df_a(pa);

  vec2 pn = p;
  pn.x -= 0.0*sz;
  float dn = df_n(pn);
  
  vec2 pc = p;
  pc.x -= 1.0*sz;
  float dc = df_c(pc);
  
  vec2 pe = p;
  pe.x -= 2.0*sz;
  float de = df_e(pe);

  vec2 ph = op;
  ph.y -= -0.025;
  ph = ph.yx;
  float dh = -hexagon(ph, 1.99);
  
  float d = dl;
  d = min(d, da);
  d = min(d, dc);
  d = min(d, dn);
  d = min(d, de);
  
  return vec3(d, length(pa), dh);
}

// License: Unknown, author: Martijn Steinrucken, found: https://www.youtube.com/watch?v=VmrIDyYiJBA
vec2 hextile(inout vec2 p) {
  // See Art of Code: Hexagonal Tiling Explained!
  // https://www.youtube.com/watch?v=VmrIDyYiJBA
  const vec2 sz       = vec2(1.0, sqrt(3.0));
  const vec2 hsz      = 0.5*sz;

  vec2 p1 = mod(p, sz)-hsz;
  vec2 p2 = mod(p - hsz, sz)-hsz;
  vec2 p3 = dot(p1, p1) < dot(p2, p2) ? p1 : p2;
  vec2 n = ((p3 - p + hsz)/sz);
  p = p3;

  n -= vec2(0.5);
  // Rounding to make hextile 0,0 well behaved
  return round(n*2.0)*0.5;
}

vec2 transform(vec2 p) {
  float a = TTIME/55.0;
  p *= 3.3;
  vec2 p0 = toSmith(p);
  p0 += vec2(1.0, -1.0)*mix(-1.0, 1.0, smoothstep(-0.25, 0.25, -sin(0.5*a)));
  vec2 p1 = toSmith(p);
  p1 *= ROT(-a);
  p = fromSmith(p0*p1.yx);
  p *= ROT(0.5*dot(p, p));
  p -= -TIME*0.1;
  return p;
}

vec3 effect(vec2 p) {
  const float iz = 4.0;
  p = transform(p);
  float aa = iz*length(fwidth(p))*sqrt(0.5);
  vec2 n = hextile(p);
  p *= iz;
  vec3 d3 = df(p);
  float d = d3.x;
  float g = d3.y;
  float dd = d3.z;
  const float hoff = COLORTUNE;
  const vec3 bcol  = HSV2RGB(vec3(hoff+0.64, 0.9, 1.5));
  const vec3 gcol  = HSV2RGB(vec3(hoff+0.61, 0.9, 1.0));
  const vec3 bbcol = HSV2RGB(vec3(hoff+0.64, 0.75, 0.66));
  const vec3 scol  = HSV2RGB(vec3(hoff+0.55, 0.925, 3.0));
 
  float amb = mix(0.025, 0.1, tanh_approx(0.1+0.25*g+0.33*p.y));

  vec3 col = vec3(0.0);
  
  col = mix(col, 5.0*sqrt(amb)*bcol, smoothstep(aa, -aa, d));
  col = mix(col, 4.0*sqrt(amb)*bbcol, smoothstep(aa, -aa, dd));
  col += 0.125*bcol*exp(-12.0*max(min(d, dd), 0.0));
  col += gcol*amb;
  col += scol*aa;

  return col;
}

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
  vec2 q = fragCoord/RESOLUTION.xy;
  vec2 p = -1. + 2. * q;
  p.x *= RESOLUTION.x/RESOLUTION.y;
  vec3 col = effect(p);;
  col *= smoothstep(0.0, 4.0, TIME-dot(p, p));
  col = aces_approx(col);
  col = sRGB(col);
  fragColor = vec4(col, 1.0);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}