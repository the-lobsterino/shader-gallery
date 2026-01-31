#extension GL_OES_standard_derivatives : enable


precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
	The flicking flower: pink
*/

#define I resolution
#define PI 3.1415926
#define op min
#define gd(p, no) clamp(dot(no, vec3(p, -.5)), 0.0, 1.0)
#define T(a) fract(time * a) * PI * 4.
#define fk .125 * cos( T( .125 ) )

// smax
float s(float a, float b, float c) {
  float d = clamp(.2 + .5 * (-b + a) / c, 0., 1.);
  return -(mix(-b, -a, d) - c * d * (1. - d));
}

mat2 rot(float a) {
  float s = sin(a), c = cos(a);
  return mat2(c, s, -s, c);
}
// repetition
float rp(inout vec2 b, float e) {
  float a = 6.28 / e, f = (atan(b.y, b.x) + a * .5) / a, c = floor(f),
        h = a * c;
  b *= rot(h);
  return c;
}
// calcRoot
float cr(vec3 p) {
  float d = .1;

  // p.xy *= rot(PI * .15);
  p -= vec3(.1, -.6, .4);

  d = max(
      length(p.xz + vec2(.25 * pow(p.y, 2.) + .125 * -p.x - fk * ( p.y / 2. + .5 ), 0.)) -
          .1,
      ( p.y / 2. + .5) - 1. );
      // ( p.y / 2. + .5) - .08 * T( .25 ) ); // grow up

  return d;
}
// petalUnit
float pt(vec3 p) {
  p.xy *= rot(PI * -.5), p.yz *= rot(PI * -.1);

  vec3 op = p;

  p.y -= .25;

  float t = s(s(abs(p.x) - .1, abs(p.z) - .1, .02), abs(p.y) - .1, .02);

  p = op;

  float py = p.y;
  py = py > 0. ? py * 5. : py, py = py < 0. ? py * 2. : py,
  py = clamp(py, -1., 1.), py = abs(abs(pow(py, 2.)) - 1.);

  return s(max(s(abs(p.x) - .18 * py, abs(p.z) - .1 * py, .1), abs(p.y) - .5),
           -t, .1);
}
// calcPetals
float cp(vec3 p) {
  p.x = p.x - fk;

  p.y -= .3;
  p.yz *= rot(PI * .15);
  p.xz *= rot(PI * -.05);

  float d = .1;

  float r = rp(p.xy, 7.);

  d = min(d, pt(p + vec3(-0.55, 0., 0.)));

  return d;
}
// calcPistil
float cs(vec3 p) { return length(p - vec3( fk, .25, .05)) - .2; }
// leafsPos
float g(vec2 p, float s) { return length(p + vec2(s, 0.)) - .3; }
// calcLeafs
float cl(vec3 p) {
  
  p.x -=  .125 * .6 * cos( T( .125 ) );
  p += vec3(-.042, .6, 0.);
  

  float r = rp(p.xy, 2.);
  p += vec3(-.25, .1, 0.);

  p.xy *= rot(PI * -.5);
  p.xz *= rot(PI * .4);


  return max(max(max(g(p.xy, .06), g(p.xy, -.06)), abs(p.z) - .01),
             -(p.y + .2));
}
// sdf
float df(vec3 p) {
  float d = .1;
  d = op(d, cp(p));

  d = op(d, cs(p));

  d = op(d, cr(p));

  d = op(d, cl(p));

  return d;
}
// calcNormal (IQ)
vec3 l(in vec3 b) {
  vec2 a = vec2(1, -1) * .5773;
  return normalize(a.xyy * df(b + a.xyy * 5e-4) + a.yyx * df(b + a.yyx * 5e-4) +
                   a.yxy * df(b + a.yxy * 5e-4) + a.xxx * df(b + a.xxx * 5e-4));
}

vec4 mainImage(out vec4 U, in vec2 V) {
  vec2 u = ((V / I.xy) - .5) * 2.;
  u.x *= I.x / I.y;

  vec3 c, p, n, o = vec3(0., 0., -5.), r = vec3(u * .28, 1.);
  float t, d, d1, d2;

  for (float i = 0.; i < 64.; i++) // raymarching
    p = o + r * t, d = df(p), t += d;

  if (d < 1e-3)
    n = l(p), d1 = gd(vec2(-.4, 1), n), d2 = gd(vec2(-.2, .2), n), c = vec3(1.),
    // map or shaded each item
    c = df(p) == cp(p)                       ? vec3(.98, .56, .59) * d1
        : df(p) == cs(p)                     ? vec3(3. * d2)
        : (df(p) == cl(p) || df(p) == cr(p)) ? vec3(.45, .67, .18) * d1
                                             : p;

  return vec4( c, 1. );
}

void main(){
	gl_FragColor = mainImage( gl_FragColor, gl_FragCoord.xy );
}