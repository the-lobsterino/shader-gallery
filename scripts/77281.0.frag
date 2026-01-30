/*
 * Original shader from: https://www.shadertoy.com/view/ftGGWD
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
// "Slithering Worm" by dr2 - 2021
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

float PrRoundBox2Df (vec2 p, vec2 b, float r);
float PrCapsDf (vec3 p, float r, float h);
float Minv2 (vec2 p);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);
vec2 Rot2Cs (vec2 q, vec2 cs);
float Fbm1 (float p);
float Fbm2 (vec2 p);
vec3 VaryNf (vec3 p, vec3 n, float f);

vec3 sunDir = vec3(0.), qHit = vec3(0.);
float tCur = 0., dstFar = 0., tCyc = 0., nCyc = 0., segRot = 0.;
const float nSeg = 8.;
int idObj = 0;
const float pi = 3.1415927;

#if 0
#define VAR_ZERO min (iFrame, 0)
#else
#define VAR_ZERO 0
#endif

#define DMINQ(id) if (d < dMin) { dMin = d;  idObj = id;  qHit = q; }

struct Arc {
  vec2 cs, css;
  float chDist, ang, rad;
};
Arc arc;

#define F(x) (sin (x) / x - b)

float SecSolve (float b)
{  // (from "Robotic Head") 
  vec3 t;
  vec2 f;
  t.yz = vec2 (0.7, 1.2);
  f = vec2 (F(t.y), F(t.z));
  for (int nIt = 0; nIt < 4; nIt ++) {
    t.x = (t.z * f.x - t.y * f.y) / (f.x - f.y);
    t.zy = t.yx;
    f = vec2 (F(t.x), f.x);
  }
  return t.x;
}

void ArcConf ()
{
  vec2 u;
  float arcLen, arcEx, chLen, len, sep;
  len = 2.;
  sep = 1.;
  arcEx = 1.;
  arcLen = arcEx * length (vec2 (len, sep));
  u = vec2 (len * sin (0.5 * segRot), sep);
  chLen = length (u);
  arc.ang = SecSolve (chLen / arcLen);
  arc.chDist = chLen / tan (arc.ang);
  arc.rad = sqrt (arc.chDist * arc.chDist + chLen * chLen);
  arc.cs = sin (- arc.ang + vec2 (0.5 * pi, 0.));
  arc.css = sin (- arc.ang - 0.002 + vec2 (0.5 * pi, 0.));
}

float ObjDf (vec3 p)
{
  vec3 q;
  vec2 cs;
  float dMin, d, tRad, tBmp, s, da, rr, nc;
  dMin = dstFar;
  tRad = 0.5;
  tBmp = 0.05;
  da = 63. / (2. * arc.ang);
  nCyc = floor (tCur / tCyc);
  cs = sin (arc.ang * (1. - 2. * (tCur / tCyc - nCyc)) + vec2 (0.5 * pi, 0.));
  p.y -= tRad + tBmp;
  nc = floor (nCyc / 2.);
  s = sign (nCyc - 2. * nc - 0.5);
  rr = arc.rad * arc.cs.y;
  p.x += (4. * nc + s - 2. - mod (nSeg, 2.)) * rr;
  p.yz = p.zy;
  p.xy *= vec2 (-1., s);
  for (float k = float (VAR_ZERO); k < nSeg; k ++) {
    q = p;
    q.y *= - sign (mod (k, 2.) - 0.5);
    q.xy -= vec2 (rr * (2. * k - nSeg + 0.5), - arc.chDist);
    d = dot (vec2 (abs (q.x), q.y), arc.css);
    d = max (length (vec2 (length (q.xy) - arc.rad, q.z)) - tRad + tBmp * (1. -
       smoothstep (0.1, 0.4, 0.5 - abs (0.5 -  mod (da * (atan (q.x, q.y) / (2. * pi)), 1.)))), d);
    if (k == 0. || k == nSeg - 1.) d = max (d, - sign (k - 0.5) * dot (q.xy, cs * vec2 (1., -1.)));
    DMINQ (1);
    if (k == 0. || k == nSeg - 1.) {
      q.xy = Rot2Cs (q.xy, cs);
      q.y -= arc.rad;
      d = PrCapsDf (q.yzx, tRad + tBmp, 0.1);
      DMINQ (2);
    }
  }
  return dMin;
}

float GrObjDf (vec2 pg)
{
  vec3 p, q;
  vec2 dkMin, cs;
  float d, tRad, s, rr, nc;
  dkMin = vec2 (dstFar, 0.);
  tRad = 0.5 - 0.15;
  nCyc = floor (tCur / tCyc);
  cs = sin (arc.ang * (1. - 2. * (tCur / tCyc - nCyc)) + vec2 (0.5 * pi, 0.));
  p.xz = pg;
  p.y = 0.;
  nc = floor (nCyc / 2.);
  s = sign (nCyc - 2. * nc - 0.5);
  rr = arc.rad * arc.cs.y;
  p.x += (4. * nc + s - 2. - mod (nSeg, 2.)) * rr;
  p.yz = p.zy;
  p.xy *= vec2 (-1., s);
  for (float k = float (VAR_ZERO) - 2. * nSeg; k < nSeg; k ++) {
    q = p;
    q.y *= - sign (mod (k, 2.) - 0.5);
    q.xy -= vec2 (rr * (2. * k - nSeg + 0.5), - arc.chDist);
    d = dot (vec2 (abs (q.x), q.y), arc.css);
    d = max (length (vec2 (length (q.xy) - arc.rad, q.z)) - tRad, d);
    if (k == - 2. * nSeg || k == nSeg - 1.) d = max (d, - sign (k - 0.5) *
       dot (q.xy, cs * vec2 (1., -1.)));
    if (d < dkMin.x) dkMin = vec2 (d, k);
    if (k == - 2. * nSeg || k == nSeg - 1.) {
      q.xy = Rot2Cs (q.xy, cs);
      q.y -= arc.rad;
      d = PrCapsDf (q.yzx, tRad, 0.1);
      if (d < dkMin.x) dkMin = vec2 (d, k);
    }
  }
  dkMin.y = 1. + min (dkMin.y / nSeg, 0.) / 2.;
  return dkMin.y * step (dkMin.x, 0.);
}

float ObjRay (vec3 ro, vec3 rd)
{
  vec3 p;
  float dHit, d;
  dHit = 0.;
  for (int j = VAR_ZERO; j < 120; j ++) {
    p = ro + dHit * rd;
    d = ObjDf (p);
    if (d < 0.0005 || dHit > dstFar || p.y < 0.) break;
    dHit += d;
  }
  if (p.y < 0.) dHit = dstFar;
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  vec2 e;
  e = vec2 (0.001, -0.001);
  for (int j = VAR_ZERO; j < 4; j ++) {
    v[j] = ObjDf (p + ((j < 2) ? ((j == 0) ? e.xxx : e.xyy) : ((j == 2) ? e.yxy : e.yyx)));
  }
  v.x = - v.x;
  return normalize (2. * v.yzw - dot (v, vec4 (1.)));
}

float ObjSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 0.02;
  for (int j = VAR_ZERO; j < 30; j ++) {
    h = ObjDf (ro + d * rd);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += h;
    if (sh < 0.05) break;
  }
  return 0.6 + 0.4 * sh;
}

vec3 SkyBgCol (vec3 ro, vec3 rd)
{
  vec3 col, clCol, skCol;
  vec2 q;
  float f, fd, ff, sd;
  if (rd.y > -0.02 && rd.y < 0.03 * Fbm1 (16. * atan (rd.z, - rd.x))) {
    col = vec3 (0.3, 0.4, 0.5);
  } else {
    q = 0.02 * (ro.xz + 2. * tCur + ((100. - ro.y) / rd.y) * rd.xz);
    ff = Fbm2 (q);
    f = smoothstep (0.2, 0.8, ff);
    fd = smoothstep (0.2, 0.8, Fbm2 (q + 0.01 * sunDir.xz)) - f;
    clCol = (0.7 + 0.5 * ff) * (vec3 (0.7) - 0.7 * vec3 (0.3, 0.3, 0.2) * sign (fd) *
       smoothstep (0., 0.05, abs (fd)));
    sd = max (dot (rd, sunDir), 0.);
    skCol = vec3 (0.3, 0.4, 0.8) + step (0.1, sd) * vec3 (1., 1., 0.9) *
       min (0.3 * pow (sd, 64.) + 0.5 * pow (sd, 2048.), 1.);
    col = mix (skCol, clCol, 0.1 + 0.9 * f * smoothstep (0.01, 0.1, rd.y));
  }
  return col;
}

float GrndHtN (vec2 p)
{
  return 0.3 * Fbm2 (2. * p);
}

vec3 GrndNf (vec3 p)
{
  vec2 e;
  e = vec2 (0.01, 0.);
  return normalize (vec3 (GrndHtN (p.xz) - vec2 (GrndHtN (p.xz + e.xy),
     GrndHtN (p.xz + e.yx)), e.x)).xzy;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4, hCol4, bCol4, sCol4;
  vec3 col, vn;
  float dstObj, dstGrnd, nDotL, sh, s, f;
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    bCol4 = vec4 (0.8, 0.6, 0.2, 0.2);
    hCol4 = vec4 (0., 0.5, 1., 0.2);
    sCol4 = vec4 (1., 1., 1., 0.3);
    ro += dstObj * rd;
    vn = ObjNf (ro);
    if (idObj == 1) {
      qHit.xy = Rot2Cs (qHit.xy, sin (arc.ang * (1. - 2. * (tCur / tCyc - nCyc)) +
         vec2 (0.5 * pi, 0.)));
      s = abs (length (qHit.xy) - arc.rad);
      f = Minv2 (Rot2D (0.5 - abs (0.5 - mod (4. * atan (qHit.xz, vec2 (qHit.y, s)) /
         vec2 (arc.ang, pi), 1.)), 0.25 * pi));
      col4 = mix (bCol4, hCol4, smoothstep (0., 0.03, f + 0.05));
      if (qHit.z > 0.) col4 = mix (sCol4, col4, smoothstep (0., 0.03, s - 0.03));
    } else if (idObj == 2) {
      if (qHit.x > 0.) {
        col4 = bCol4 * (0.3 + 0.7 * smoothstep (0., 0.03, PrRoundBox2Df (qHit.yz,
           vec2 (0., 0.13), 0.02)));
      } else {
        col4 = bCol4 * (0.3 + 0.7 * smoothstep (0., 0.03, PrRoundBox2Df (qHit.yz -
           vec2 (0., -0.2), vec2 (0.3, 0.), 0.02)));
        col4 = mix (vec4 (1., 0., 0., -1.), col4, step (0.1,
           length (vec2 (abs (qHit.y) - 0.2, qHit.z - 0.1))));
      }
      col4 = mix (hCol4, col4, smoothstep (0., 0.03, abs (abs (qHit.x) - 0.25) - 0.15));
      if (qHit.z > 0. && abs (qHit.x) < 0.5) col4 = mix (sCol4, col4,
         smoothstep (0., 0.03, abs (qHit.y) - 0.03));
    }
  } else if (rd.y < 0.) {
    dstGrnd = - ro.y / rd.y;
    ro += dstGrnd * rd;
    col4 = 0.6 * mix (vec4 (1., 0.8, 0.5, 0.), vec4 (0.9, 0.7, 0.5, 0.), 0.2 +
       0.8 * smoothstep (0.3, 0.7, Fbm2 (2. * ro.xz)));
    f = 1. - smoothstep (0.4, 0.7, dstGrnd / dstFar);
    vn = GrndNf (ro);
    s = GrObjDf (ro.xz);
    col4 *= 1. - 0.1 * s;
    vn = VaryNf (8. * ro, vn, 2. * f + 8. * s);
  } else {
    col = SkyBgCol (ro, rd);
  }
  if (dstObj < dstFar || rd.y < 0.) { 
    if (col4.a >= 0.) {
      nDotL = max (dot (vn, sunDir), 0.);
      if (dstObj < dstFar && idObj == 1) nDotL *= nDotL;
      sh = (rd.y < 0.) ? ObjSShadow (ro + 0.01 * vn, sunDir) : 1.;
      col = col4.rgb * (0.3 + 0.7 * sh * nDotL) +
         col4.a * step (0.95, sh) * pow (max (dot (sunDir, reflect (rd, vn)), 0.), 32.);
      col = mix (col, vec3 (0.3, 0.4, 0.5), pow (1. + rd.y, 16.));
    } else col = col4.rgb * (0.5 + 0.5 * max (- dot (rd, vn), 0.));
  }
  return clamp (col, 0., 1.);
}

#define AA  0   // optional antialiasing

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, col;
  vec2 canvas, uv;
  float el, az, zmFac, sr;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  az = 0.;
  el = -0.13 * pi;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += pi * mPtr.y;
  } else {
    az -= 0.03 * pi * tCur;
    el -= 0.1 * pi * sin (0.02 * pi * tCur);
  }
  el = clamp (el, -0.4 * pi, -0.05 * pi);
  vuMat = StdVuMat (el, az);
  tCyc = 4.;
  segRot = pi * (0.4 + 0.*0.1 * floor (mod (tCur / (5. * tCyc), 4.)));
  ArcConf ();
  ro = vuMat * vec3 (0., 0., -40.);
  ro.x -= arc.rad * arc.cs.y * (2. * tCur / tCyc - (nSeg + 1.) / 2.);
  zmFac = 6. + 2.5 * el;
  dstFar = 100.;
  sunDir = vuMat * normalize (vec3 (1., 2., -1.));
#if ! AA
  const float naa = 1.;
#else
  const float naa = 3.;
#endif  
  col = vec3 (0.);
  sr = 2. * mod (dot (mod (floor (0.5 * (uv + 1.) * canvas), 2.), vec2 (1.)), 2.) - 1.;
  for (float a = float (VAR_ZERO); a < naa; a ++) {
    rd = vuMat * normalize (vec3 (uv + step (1.5, naa) * Rot2D (vec2 (0.5 / canvas.y, 0.),
       sr * (0.667 * a + 0.5) * pi), zmFac));
    col += (1. / naa) * ShowScene (ro, rd);
  }
  fragColor = vec4 (col, 1.);
}

float PrRoundBox2Df (vec2 p, vec2 b, float r)
{
  return length (max (abs (p) - b, 0.)) - r;
}

float PrCapsDf (vec3 p, float r, float h)
{
  return length (p - vec3 (0., 0., clamp (p.z, - h, h))) - r;
}

float Minv2 (vec2 p)
{
  return min (p.x, p.y);
}

mat3 StdVuMat (float el, float az)
{
  vec2 ori, ca, sa;
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  return mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
         mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
}

vec2 Rot2D (vec2 q, float a)
{
  vec2 cs;
  cs = sin (a + vec2 (0.5 * pi, 0.));
  return vec2 (dot (q, vec2 (cs.x, - cs.y)), dot (q.yx, cs));
}

vec2 Rot2Cs (vec2 q, vec2 cs)
{
  return vec2 (dot (q, vec2 (cs.x, - cs.y)), dot (q.yx, cs));
}

const float cHashM = 43758.54;

vec2 Hashv2f (float p)
{
  return fract (sin (p + vec2 (0., 1.)) * cHashM);
}

vec2 Hashv2v2 (vec2 p)
{
  vec2 cHashVA2 = vec2 (37., 39.);
  return fract (sin (dot (p, cHashVA2) + vec2 (0., cHashVA2.x)) * cHashM);
}

float Noiseff (float p)
{
  vec2 t;
  float ip, fp;
  ip = floor (p);
  fp = fract (p);
  fp = fp * fp * (3. - 2. * fp);
  t = Hashv2f (ip);
  return mix (t.x, t.y, fp);
}

float Noisefv2 (vec2 p)
{
  vec2 t, ip, fp;
  ip = floor (p);  
  fp = fract (p);
  fp = fp * fp * (3. - 2. * fp);
  t = mix (Hashv2v2 (ip), Hashv2v2 (ip + vec2 (0., 1.)), fp.y);
  return mix (t.x, t.y, fp.x);
}

float Fbm1 (float p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int j = 0; j < 5; j ++) {
    f += a * Noiseff (p);
    a *= 0.5;
    p *= 2.;
  }
  return f * (1. / 1.9375);
}

float Fbm2 (vec2 p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int j = 0; j < 5; j ++) {
    f += a * Noisefv2 (p);
    a *= 0.5;
    p *= 2.;
  }
  return f * (1. / 1.9375);
}

float Fbmn (vec3 p, vec3 n)
{
  vec3 s;
  float a;
  s = vec3 (0.);
  a = 1.;
  for (int j = 0; j < 5; j ++) {
    s += a * vec3 (Noisefv2 (p.yz), Noisefv2 (p.zx), Noisefv2 (p.xy));
    a *= 0.5;
    p *= 2.;
  }
  return dot (s, abs (n));
}

vec3 VaryNf (vec3 p, vec3 n, float f)
{
  vec4 v;
  vec3 g;
  vec2 e;
  e = vec2 (0.1, 0.);
  for (int j = VAR_ZERO; j < 4; j ++)
     v[j] = Fbmn (p + ((j < 2) ? ((j == 0) ? e.xyy : e.yxy) : ((j == 2) ? e.yyx : e.yyy)), n);
  g = v.xyz - v.w;
  return normalize (n + f * (g - n * dot (n, g)));
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}