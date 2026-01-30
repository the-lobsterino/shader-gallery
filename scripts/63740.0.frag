/*
 * Original shader from: https://www.shadertoy.com/view/MtjcDd
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
// "Steam Engine No.3" by dr2 - 2017
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

float PrBoxDf (vec3 p, vec3 b);
float PrSphDf (vec3 p, float s);
float PrCylDf (vec3 p, float r, float h);
float PrCylAnDf (vec3 p, float r, float w, float h);
float SmoothMin (float a, float b, float r);
float SmoothBump (float lo, float hi, float w, float x);
vec2 Rot2D (vec2 q, float a);
vec2 Rot2Cs (vec2 q, vec2 cs);
float Noisefv2 (vec2 p);
float Fbm2 (vec2 p);
vec3 VaryNf (vec3 p, vec3 n, float f);

vec3 ltDir = vec3(0.), qHit = vec3(0.);
vec2 aCs[3], crCs[3], crMid[3];
float tCur = 0., dstFar = 0., crRad = 0., crLen = 0., aRot = 0.;
const float pi = 3.14159;
int idObj = 0;
const int idWhl = 1, idSpk = 2, idCrnk = 3, idAx = 4, idPis = 5, idCrod = 6, idCyl = 7,
   idCylEnt = 8, idValv = 9, idPipes = 10, idSup = 11, idBase = 12;

float ObjDf (vec3 p)
{
  vec3 q;
  float dMin, d, dz;
  dMin = dstFar;
  p.x -= 8.;
  q = p;
  q.xy = Rot2Cs (q.xy, aCs[0]);
  q.z = abs (q.z) - 7.3;
  d = min (PrCylAnDf (q, 4., 0.2, 0.8), PrCylDf (q, 0.6, 0.8));
  if (d < dMin) { dMin = d;  idObj = idWhl;  qHit = q; }
  q.xy = Rot2D (q.xy, 2. * pi * (floor (6. * atan (q.y, - q.x) / (2. * pi) + 0.5)) / 6.);
  d = PrBoxDf (vec3 (q.x + 2.2, q.y, abs (q.z) - 0.5), vec3 (1.7, 0.15, 0.25));
  if (d < dMin) { dMin = d;  idObj = idSpk; }
  d = max (PrCylDf (p, 0.3, 8.2), min (0.35 - abs (mod (p.z + 2., 4.) - 2.), 6. - abs (p.z)));
  if (d < dMin) { dMin = d;  idObj = idAx; }
  for (int k = 0; k < 3; k ++) {
    dz = float (k - 1) * 4.;
    q = p;
    q.xy = Rot2Cs (q.xy, aCs[k]);
    q.z += dz;
    d = min (PrBoxDf (vec3 (q.x + 0.5 * crRad, q.y, abs (q.z) - 0.5), vec3 (0.5 * crRad, 0.2, 0.1)),
       PrCylDf (vec3 (abs (q.x + 0.5 * crRad) - 0.5 * crRad, q.y, abs (q.z) - 0.5), 0.6, 0.1));
    if (d < dMin) { dMin = d;  idObj = idCrnk; }
    d = min (PrCylDf (vec3 (q.x + crRad, q.yz), 0.3, 0.65), d);
    if (d < dMin) { dMin = d;  idObj = idAx; }
    q = p;  q.z += dz;
    q.xy = Rot2Cs (q.xy + crMid[k], crCs[k]);
    d = min (PrCylDf (vec3 (abs (q.y) - 0.12, q.zx), 0.15, crLen - 0.5),
       PrCylDf (vec3 (abs (q.x) - crLen, q.yz), 0.6, 0.15));
    if (d < dMin) { dMin = d;  idObj = idCrod; }
    q = p;  q.z += dz;  q.x -= - (4.5 + crMid[k].x + crLen * crCs[k].x);
    d = PrCylDf (q.yzx, 0.25, 3.7);
    if (d < dMin) { dMin = d;  idObj = idPis; }
    d = PrCylDf ((q - vec3 (0.7, 1.7, 0.)).yzx, 0.07, 3.);
    if (d < dMin) { dMin = d;  idObj = idPis; }
    q.x -= 4.5;
    d = PrCylDf (q, 0.3, 0.5);
    if (d < dMin) { dMin = d;  idObj = idAx; }
    d = min (min (PrCylDf ((q + vec3 (0.8, 0., 0.)).yzx, 0.6, 0.13),
       PrCylDf ((q + vec3 (0.8, -0.8, 0.)).xzy, 0.08, 0.95)),
       PrCylDf (vec3 (q.xy, abs (q.z) - 0.35), 0.7, 0.1));
    if (d < dMin) { dMin = d;  idObj = idCrnk; }
  }
  q = p + vec3 (16.9, 0., 0.);  q.z = mod (q.z + 2., 4.) - 2.;
  d = max (PrCylDf ((q + vec3 (-3.5, 0., 0.)).yzx, 0.7, 0.2), abs (p.z) - 6.);
  if (d < dMin) { dMin = d;  idObj = idCylEnt;  qHit = q; }
  d = max (PrCylDf (q.yzx, 1.5, 3.5), abs (p.z) - 6.);
  if (d < dMin) { dMin = d;  idObj = idCyl;  qHit = q; }
  q = p + vec3 (16.9, -1.7, 0.);  q.z = mod (q.z + 2., 4.) - 2.;
  d = max (PrCylDf (q.yzx, 0.5, 2.5), abs (p.z) - 6.);
  if (d < dMin) { dMin = d;  idObj = idValv;  qHit = q; }
  q = vec3 (abs (p.x + 16.9) - 1.5, p.y - 2.7, p.z);
  d = min (min (max (PrCylDf ((vec3 (q.x, q.y, mod (q.z + 2., 4.) - 2.)).xzy, 0.35, 0.75),
     abs (p.z) - 6.), PrCylDf (vec3 (q.x, q.y - 0.75, q.z), 0.35, 4.)),
     PrSphDf (vec3 (q.x, q.y - 0.75, abs (q.z) - 4.), 0.35));
  q = vec3 (p.x + 16.9, p.y - 1., p.z);
  d = min (d, min (PrCylDf ((q + vec3 (-1.5, 0., 2.)).xzy, 0.35, 2.5),
     PrCylDf ((q + vec3 (1.5, 0., -2.)).xzy, 0.35, 2.5)));
  if (d < dMin) { dMin = d;  idObj = idPipes; }
  q = p;  q.z = abs (abs (p.z) - 4.) - 1.7;
  d = min (PrBoxDf (q + vec3 (0., 1.6, 0.), vec3 (0.5, 1.5, 0.2)), PrCylDf (q, 0.5, 0.3));
  if (d < dMin) { dMin = d;  idObj = idSup; }
  q = p + vec3 (0., -1.8, 2.3);
  d = PrCylDf ((q + vec3 (0., 0.6, 0.)).xzy, 0.12, 0.8);
  q.xz = Rot2D (q.xz, 4. * aRot);
  q.xz = Rot2D (q.xz, 2. * pi * (floor (4. * atan (q.z, - q.x) / (2. * pi) + 0.5)) / 4.);
  q.xy = Rot2D (q.xy, -0.25 * pi);
  d = min (d, PrCylDf ((q + vec3 (0.4, -0.1, 0.)).yzx, 0.05, 0.4));
  if (d < dMin) { dMin = d;  idObj = idAx; }
  d = PrSphDf (q + vec3 (0.7, -0.1, 0.), 0.15);
  if (d < dMin) { dMin = d;  idObj = idPis; }
  d = min (PrBoxDf (p + vec3 (8., 4., 0.), vec3 (13., 1., 6.)),
     PrBoxDf (vec3 (abs (p.x + 17.) - 2., p.y + 2.5, p.z), vec3 (1., 1.4, 5.)));
  if (d < dMin) { dMin = d;  idObj = idBase; }
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 160; j ++) {
    d = ObjDf (ro + rd * dHit);
    if (d < 0.0005 || dHit > dstFar) break;
    dHit += d;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  vec3 e = vec3 (0.0005, -0.0005, 0.);
  v = vec4 (ObjDf (p + e.xxx), ObjDf (p + e.xyy), ObjDf (p + e.yxy), ObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

vec3 ShGrid (vec2 p)
{
  vec2 q, sq, ss;
  q = p;
  sq = smoothstep (0.05, 0.1, abs (fract (q + 0.5) - 0.5));
  q = fract (q) - 0.5;
  ss = 0.3 * smoothstep (0.3, 0.5, abs (q.xy)) * sign (q.xy);
  if (abs (q.x) < abs (q.y)) ss.x = 0.;
  else ss.y = 0.;
  return vec3 (ss.x, 0.8 + 0.2 * sq.x * sq.y, ss.y);
}

vec3 ShStagGrid (vec2 p, vec2 g)
{
  vec2 q, sq, ss;
  q = p * g;
  if (2. * floor (0.5 * floor (q.y)) != floor (q.y)) q.x += 0.5;
  sq = smoothstep (0.05, 0.1, abs (fract (q + 0.5) - 0.5));
  q = fract (q) - 0.5;
  ss = 0.3 * smoothstep (0.3, 0.5, abs (q.xy)) * sign (q.xy);
  if (abs (q.x) < abs (q.y)) ss.x = 0.;
  else ss.y = 0.;
  return vec3 (ss.x, 0.8 + 0.2 * sq.x * sq.y, ss.y);
}

float ObjSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 0.01;
  for (int j = 0; j < 30; j ++) {
    h = ObjDf (ro + rd * d);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += max (0.01, h);
    if (sh < 0.05) break;
  }
  return sh;
}

vec2 BlkHit (vec3 ro, vec3 rd)
{
  vec3 v, tm, tp, u, qnBlk;
  vec2 qBlk;
  float dn, df, bSize;
  bSize = dstFar;
  if (rd.x == 0.) rd.x = 0.001;
  if (rd.y == 0.) rd.y = 0.001;
  if (rd.z == 0.) rd.z = 0.001;
  v = ro / rd;
  tp = bSize / abs (rd) - v;
  tm = - tp - 2. * v;
  dn = max (max (tm.x, tm.y), tm.z);
  df = min (min (tp.x, tp.y), tp.z);
  if (df > 0. && dn < df) {
    qnBlk = - sign (rd) * step (tm.zxy, tm) * step (tm.yzx, tm);
    u = (v + dn) * rd;
    qBlk = vec2 (dot (u.zxy, qnBlk), dot (u.yzx, qnBlk)) / bSize;
  } else qBlk = vec2 (0.);
  return qBlk;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, vn, rg;
  vec2 qBlk;
  float dstObj, a, s, sh;
  bool fxz;
  aRot = -0.4 * 2. * pi * tCur;
  aCs[0] = vec2 (cos (aRot), sin (aRot));
  aCs[1] = vec2 (cos (aRot + pi * 2./3.), sin (aRot + pi * 2./3.));
  aCs[2] = vec2 (cos (aRot + pi * 4./3.), sin (aRot + pi * 4./3.));
  crRad = 2.;
  crLen = 5.;
  for (int k = 0; k < 3; k ++) {
    crMid[k].y = -0.5 * crRad * aCs[k].y;
    crCs[k] = vec2 (cos (asin (crMid[k].y / crLen)), crMid[k].y / crLen);
    crMid[k].x = crLen * crCs[k].x + crRad * aCs[k].x;
  }
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    qBlk = mod (2. * BlkHit (ro, reflect (rd, vn)), 1.);
    if (idObj == idBase) {
      col4 = vec4 (0.3, 0.5, 0.6, 0.1);
      if (abs (vn.y) < 0.01) {
        rg = ro;
        rg.y += 0.5;
        fxz = (abs (vn.x) > 0.99);
        rg = ShStagGrid ((fxz ? rg.zy : rg.xy), vec2 (1., 2.));
        col4.r *= rg.y;
        col4.rgb *= 1. - 0.3 * Fbm2 (2. * (fxz ? ro.zy : ro.xy));
        rg.xz *= sign (fxz ? vn.x : vn.z);
        if (fxz) {
          if (rg.x == 0.) vn.xy = Rot2D (vn.xy, rg.z);
          else vn.xz = Rot2D (vn.xz, rg.x);
        } else {
          if (rg.x == 0.) vn.zy = Rot2D (vn.zy, rg.z);
          else vn.zx = Rot2D (vn.zx, rg.x);
        }
      } else {
        rg = ShGrid (ro.xz);
        col4.r *= rg.y;
        col4.rgb *= 1. - 0.3 * Fbm2 (2. * ro.xz);
        if (vn.y > 0.99) {
          if (rg.x == 0.) vn.yz = Rot2D (vn.yz, rg.z);
          else vn.yx = Rot2D (vn.yx, rg.x);
        }
      }
      vn = VaryNf (32. * ro, vn, 1.);
    } else if (idObj == idCyl) {
      col4 = vec4 (0.6, 0.3, 0.1, 0.2);
      a = atan (qHit.z, - qHit.y) / (2. * pi);
      if (abs (vn.x) > 0.99) {
        col4.r *= 1. - 0.3 * Fbm2 (4. * qHit.yz);
        col4.rgb *= (1. - 0.5 * SmoothBump (0.2, 0.4, 0.01, mod (16. * a + 0.5, 1.)) *
           SmoothBump (0.05, 0.13, 0.01, 1. - length (qHit.yz) / 1.5));
      } else {
        col4.r *= 1. - 0.3 * Fbm2 (4. * vec2 (8. * a, qHit.x));
        col4.rgb *= (1. - 0.5 * SmoothBump (0.03, 0.06, 0.01, 1. - abs (qHit.x) / 3.5));
        a = mod (32. * a, 1.);
        if (abs (qHit.x) < 3.3) vn.yz = Rot2D (vn.yz, 0.4 * SmoothBump (0.25, 0.75, 0.2, a) *
           sign (a - 0.5));
      }
    } else if (idObj == idWhl) {
      if (abs (vn.z) < 0.01) {
        s = length (qHit.xy);
        qHit.xy = vec2 (8. * atan (qHit.x, - qHit.y) / pi, qHit.z);
        if (s > 4.1) {
          s = mod (4. * qHit.z, 1.);
          vn.z = -0.2 * SmoothBump (0.25, 0.75, 0.15, s) * sign (s - 0.5) * sign (ro.z);
          vn = normalize (vn);
        }
      }
      col4 = vec4 (0.5, 0.5, 0.55, 0.05) * (1. + 0.2 * Noisefv2 (128. * qHit.xy));
    } else if (idObj == idSpk) {
      col4 = 1.1 * vec4 (0.5, 0.5, 0.55, 0.2);
    } else if (idObj == idCrnk) {
      col4 = vec4 (0.5, 0.5, 0.6, 0.2);
    } else if (idObj == idAx) {
      col4 = vec4 (0.6, 0.4, 0.1, 0.3);
    } else if (idObj == idPis) {
      col4 = vec4 (0.5, 0.5, 0.2, 0.3);
    } else if (idObj == idCrod) {
      col4 = vec4 (0.6, 0.6, 0.5, 0.3);
    } else if (idObj == idCylEnt) {
      col4 = vec4 (0.5, 0.4, 0.1, 0.2);
      if (length (qHit.yz) < 0.33) col4.rgb *= 0.5;
    } else if (idObj == idValv) {
      col4 = vec4 (0.6, 0.3, 0.1, 0.2);
      if (vn.x > 0. && length (qHit.yz) < 0.13) col4.rgb *= 0.5;
      vn = VaryNf (32. * qHit, vn, 0.3);
    } else if (idObj == idPipes) {
      col4 = vec4 (0.7, 0.5, 0.1, 0.2);
      vn = VaryNf (32. * ro, vn, 0.3);
    } else if (idObj == idSup) {
      col4 = vec4 (0.3, 0.5, 0.1, 0.05);
      vn = VaryNf (32. * ro, vn, 1.);
    }
    sh = 0.5 + 0.5 * ObjSShadow (ro, ltDir);
    col = col4.rgb * (0.2 + 0.8 * sh * max (dot (vn, ltDir), 0.)) +
       col4.a * sh * pow (max (dot (normalize (ltDir - rd), vn), 0.), 64.);
    col += col4.a * vec3 (0.4) * (0.5 + 0.5 * SmoothBump (0.25, 0.75, 0.05, qBlk.x) *
       SmoothBump (0.25, 0.75, 0.05, qBlk.y));
  } else {
    qBlk = mod (4. * BlkHit (ro, rd), 1.);
    col = vec3 (0.4, 0.5, 0.4) * (0.05 + 0.245 * (rd.y + 1.) * (rd.y + 1.)) +
       vec3 (0.2) * (0.8 + 0.2 * SmoothBump (0.25, 0.75, 0.1, qBlk.x) *
       SmoothBump (0.25, 0.75, 0.1, qBlk.y));
  }
  return clamp (col, 0., 1.);
}

void mainImage (out vec4 fragColor, vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd;
  vec2 canvas, uv, ori, ca, sa;
  float el, az, zmFac;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  az = 0.1 * pi;
  el = -0.1 * pi;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += 0.7 * pi * mPtr.y;
  } else {
    az += 0.03 * pi * tCur;
    el -= 0.05 * pi * cos (0.02 * pi * tCur);
  }
  el = clamp (el, -0.4 * pi, -0.01 * pi);
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  vuMat = mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
          mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
  ro = vuMat * vec3 (0., -1., -40.);
  zmFac = 3.7;
  rd = vuMat * normalize (vec3 (uv, zmFac));
  dstFar = 70.;
  ltDir = vuMat * normalize (vec3 (1., 1., -1.));
  fragColor = vec4 (ShowScene (ro, rd), 1.);
}

float PrBoxDf (vec3 p, vec3 b)
{
  vec3 d;
  d = abs (p) - b;
  return min (max (d.x, max (d.y, d.z)), 0.) + length (max (d, 0.));
}

float PrSphDf (vec3 p, float s)
{
  return length (p) - s;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float PrCylAnDf (vec3 p, float r, float w, float h)
{
  return max (abs (length (p.xy) - r) - w, abs (p.z) - h);
}

float SmoothMin (float a, float b, float r)
{
  float h;
  h = clamp (0.5 + 0.5 * (b - a) / r, 0., 1.);
  return mix (b, a, h) - r * h * (1. - h);
}

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
}

vec2 Rot2D (vec2 q, float a)
{
  return q * cos (a) + q.yx * sin (a) * vec2 (-1., 1.);
}

vec2 Rot2Cs (vec2 q, vec2 cs)
{
  return vec2 (dot (q, vec2 (cs.x, - cs.y)), dot (q.yx, cs));
}

const float cHashM = 43758.54;

vec2 Hashv2v2 (vec2 p)
{
  vec2 cHashVA2 = vec2 (37., 39.);
  return fract (sin (vec2 (dot (p, cHashVA2), dot (p + vec2 (1., 0.), cHashVA2))) * cHashM);
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

float Fbm2 (vec2 p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int i = 0; i < 5; i ++) {
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
  vec3 e = vec3 (0.1, 0., 0.);
  g = vec3 (Fbmn (p + e.xyy, n), Fbmn (p + e.yxy, n), Fbmn (p + e.yyx, n)) - Fbmn (p, n);
  return normalize (n + f * (g - n * dot (n, g)));
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}