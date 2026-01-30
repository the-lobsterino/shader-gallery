/*
 * Original shader from: https://www.shadertoy.com/view/XsfBWB
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// "Magic Orb" by dr2 - 2017
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

float SmoothMin (float a, float b, float r);
vec3 HsvToRgb (vec3 c);
vec2 Rot2D (vec2 q, float a);
vec3 VaryNf (vec3 p, vec3 n, float f);

vec3 ltDir = vec3(0.), qHit = vec3(0.);
float dstFar = 0., tCur = 0.;
int idObj = 0;
const float pi = 3.14159;

vec3 IcosSym (vec3 p)
{
  const float dihedIcos = 2.5 * acos (sqrt (5.) / 3.);
  float a, w;
  w = 2. * pi / 3.;
  p.z = abs (p.z);
  p.yz = Rot2D (p.yz, - dihedIcos);
  p.x = - abs (p.x);
  for (int k = 0; k < 4; k ++) {
    p.zy = Rot2D (p.zy, - dihedIcos);
    p.y = - abs (p.y);
    p.zy = Rot2D (p.zy, dihedIcos);
    if (k < 3) p.xy = Rot2D (p.xy, - w);
  }
  p.z = - p.z;
  a = mod (atan (p.x, p.y) + 0.5 * w, w) - 0.5 * w;
  p.yx = vec2 (cos (a), sin (a)) * length (p.xy);
  p.x -= 2. * p.x * step (0., p.x);
  return p;
}

float ObjDf (vec3 p)
{
  vec3 pIco;
  const vec3 vIco = normalize (vec3 (sqrt(3.), -1., 0.5 * (3. + sqrt(5.))));
  float dMin, r, d, f;
  dMin = dstFar;
  idObj = 1;
  f = 1.;
  for (int k = 0; k < 3; k ++) {
    pIco = IcosSym (p);
    r = 2.8 * f;
    d = - (0.021 * r + SmoothMin (- abs (length (p) - r),
       - length (length ((pIco + 0.411 * r * vIco).xy - 0.093 * r) -
       0.114 * r), 0.021 * r));
    if (d < dMin) { dMin = d;  qHit = p; }
    if (k == 0) p.xy = Rot2D (p.xy, 0.051 * pi * tCur);
    else if (k == 1) p.yz = Rot2D (p.yz, 0.052 * pi * tCur);
    f *= 0.93;
  }
  d = length (p) - 3.8 * f;
  if (d < dMin) { dMin = d;  idObj = 2; }
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 150; j ++) {
    d = ObjDf (ro + rd * dHit);
    if (d < 0.0005 || dHit > dstFar) break;
    dHit += d;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  vec3 e = vec3 (0.0001, -0.0001, 0.);
  v = vec4 (ObjDf (p + e.xxx), ObjDf (p + e.xyy),
     ObjDf (p + e.yxy), ObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

float ObjAO (vec3 ro, vec3 rd)
{
  float ao, d;
  ao = 0.;
  for (int j = 0; j < 8; j ++) {
    d = 0.1 + float (j) / 16.;
    ao += max (0., d - 3. * ObjDf (ro + rd * d));
  }
  return 0.5 + 0.5 * clamp (1. - 0.2 * ao, 0., 1.);
}

float ObjSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 0.05;
  for (int j = 0; j < 30; j ++) {
    h = ObjDf (ro + rd * d);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += 0.05;
    if (sh < 0.05) break;
  }
  return sh;
}

float MarbVol (vec3 p)
{
  vec3 q;
  float f;
  f = 0.;
  p *= 0.7;
  q = p;
  for (int j = 0; j < 5; j ++) {
    q = abs (q) / dot (q, q) - 0.89;
    f += 1. / (1. + abs (dot (p, q)));
  }
  return f;
}

vec3 VtRot (vec3 p, vec3 a)
{
  a *= pi * tCur;
  p.yz = Rot2D (p.yz, a.x);
  p.zx = Rot2D (p.zx, a.y);
  p.xy = Rot2D (p.xy, a.z);
  return p;
}

vec3 SphMarb (vec3 ro, vec3 rd)
{
  vec3 col;
  float t;
  col = vec3 (0.);
  ro = VtRot (ro, - vec3 (0.03, 0.022, 0.026));
  rd = VtRot (rd, - vec3 (0.03, 0.022, 0.026));
  t = 0.;
  for (int j = 0; j < 20; j ++) {
    t += 0.02;
    col = mix (HsvToRgb (vec3 (mod (0.4 * MarbVol (ro + t * rd) +
       0.03 * pi * tCur, 1.), 1., 1. / (1. + t))), col, 0.95);  
  }
  return clamp (col, 0., 1.);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec3 vn, col, bgCol, qHitT;
  float dstObj, c, sh, bk, env, eFac;
  int idObjT;
  dstObj = ObjRay (ro, rd);
  env = 1.;
  if (dstObj < dstFar) {
    ro += rd * dstObj;
    idObjT = idObj;
    qHitT = qHit;
    vn = ObjNf (ro);
    bk = max (dot (vn, - normalize (vec3 (ltDir.x, 0., ltDir.z))), 0.);
    sh = ObjSShadow (ro, ltDir);
    if (idObjT == 1) {
      col = vec3 (1., 0.95, 0.4);
      vn = VaryNf (50. * qHitT, vn, 3.);
      sh = 0.5 + 0.5 * sh;
      col = col * (0.1 + 0.1 * bk + sh * 0.7 * max (dot (vn, ltDir), 0.));
      eFac = 0.25;
    } else {
      col = 2. * (0.8 + 0.2 * sh) * SphMarb (0.5 * ro, refract (rd, vn, 1./1.5));
      eFac = 0.05;
     }
    env = eFac * ObjAO (ro, vn);
    col += sh * 0.1 * pow (max (dot (normalize (ltDir - rd), vn), 0.), 256.);
    rd = reflect (rd, vn);
  } else col = vec3 (0., 0., 0.05);
  c = (rd.y > max (abs (rd.x), abs (rd.z * 0.25))) ? min (2. * rd.y, 1.) :
     0.05 * (1. + dot (rd, ltDir));
  if (rd.y > 0.) c += 0.5 * pow (clamp (1.05 - 0.5 *
     length (max (abs (rd.xz / rd.y) - vec2 (1., 4.), 0.)), 0., 1.), 6.);
  bgCol = vec3 (0.4, 0.4, 1.) * c + 2. * vec3 (1., 0.9, 0.8) *
     (clamp (0.0002 / (1. - abs (rd.x)), 0., 1.) +
      clamp (0.0002 / (1. - abs (rd.z)), 0., 1.));
  col += env * bgCol;
  return pow (clamp (col, 0., 1.), vec3 (0.9));
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd;
  vec2 canvas, uv, ori, ca, sa;
  float az, el;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  tCur += 10.;
  if (mPtr.z > 0.) {
    az = 3. * pi * mPtr.x;
    el = -0.1 * pi + 1. * pi * mPtr.y;
  } else {
    az = 0.02 * pi * tCur;
    el = -0.25 * pi + 0.1 * pi * sin (0.022 * pi * tCur);
  }
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  vuMat = mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
          mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
  rd = vuMat * normalize (vec3 (uv, 3.6));
  ro = vuMat * vec3 (0., 0., -12.);
  ltDir = vuMat * normalize (vec3 (1., 1., -1.));
  dstFar = 30.;
  fragColor = vec4 (ShowScene (ro, rd), 1.);
}

float SmoothMin (float a, float b, float r)
{
  float h;
  h = clamp (0.5 + 0.5 * (b - a) / r, 0., 1.);
  return mix (b, a, h) - r * h * (1. - h);
}

vec2 Rot2D (vec2 q, float a)
{
  return q * cos (a) + q.yx * sin (a) * vec2 (-1., 1.);
}

vec3 HsvToRgb (vec3 c)
{
  vec3 p;
  p = abs (fract (c.xxx + vec3 (1., 2./3., 1./3.)) * 6. - 3.);
  return c.z * mix (vec3 (1.), clamp (p - 1., 0., 1.), c.y);
}

const vec4 cHashA4 = vec4 (0., 1., 57., 58.);
const vec3 cHashA3 = vec3 (1., 57., 113.);
const float cHashM = 43758.54;

vec4 Hashv4f (float p)
{
  return fract (sin (p + cHashA4) * cHashM);
}

float Noisefv2 (vec2 p)
{
  vec4 t;
  vec2 ip, fp;
  ip = floor (p);
  fp = fract (p);
  fp = fp * fp * (3. - 2. * fp);
  t = Hashv4f (dot (ip, cHashA3.xy));
  return mix (mix (t.x, t.y, fp.x), mix (t.z, t.w, fp.x), fp.y);
}

float Fbmn (vec3 p, vec3 n)
{
  vec3 s;
  float a;
  s = vec3 (0.);
  a = 1.;
  for (int i = 0; i < 3; i ++) {
    s += a * vec3 (Noisefv2 (p.yz), Noisefv2 (p.zx), Noisefv2 (p.xy));
    a *= 0.5;
    p *= 2.;
  }
  return dot (s, abs (n));
}

vec3 VaryNf (vec3 p, vec3 n, float f)
{
  vec3 g;
  float s;
  const vec3 e = vec3 (0.1, 0., 0.);
  s = Fbmn (p, n);
  g = vec3 (Fbmn (p + e.xyy, n) - s, Fbmn (p + e.yxy, n) - s,
     Fbmn (p + e.yyx, n) - s);
  return normalize (n + f * (g - n * dot (n, g)));
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}