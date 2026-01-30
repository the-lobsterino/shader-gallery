/*
 * Original shader from: https://www.shadertoy.com/view/tdlBzH
 */

#ifdef GL_ES
precision mediump float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// "Library Lost and Found" by dr2 - 2020
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

/*
  Alternating regular and pano images; mouseable - click in upper-right corner to
  switch image type, lower-right corner for monochrome image.
*/

float PrCylDf (vec3 p, float r, float h);
float SmoothBump (float lo, float hi, float w, float x);
float Minv3 (vec3 p);
float Maxv3 (vec3 p);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);
vec3 HsvToRgb (vec3 c);
float Hashfv2 (vec2 p);
float Hashfv3 (vec3 p);
float Noisefv2 (vec2 p);
float Fbm2 (vec2 p);
vec3 VaryNf (vec3 p, vec3 n, float f);
float ShowInt (vec2 q, vec2 cBox, float mxChar, float val);

vec3 bGrid = vec3(0.), qHit = vec3(0.), ltPos = vec3(0.), ltAx = vec3(0.), cId = vec3(0.);
float dstFar = 0., tCur = 0., tDir = 0., stAng = 0.;
int idObj = 0, stLib = 0;
bool isPano = false, colImg = false;
const int idFlr = 1, idCol = 2, idRail = 3, idStr = 4, idShlf = 5, idBk = 6, idLt = 7;
const float pi = 3.14159;

#define DMINQ(id) if (d < dMin) { dMin = d;  idObj = id;  qHit = q; }

#define VAR_ZERO 0

float ObjDf (vec3 p)
{
  vec3 q, qr;
  float dMin, d, r, a, s;
  dMin = dstFar;
  p -= bGrid * (cId + 0.5);
  r = length (p.xz);
  q = p;
  q.y = 0.5 * bGrid.y - 0.3 - abs (p.y);
  d = max (q.y, 9.8 - r);
  DMINQ (idFlr);
  if (stLib >= 3) {
    q.xz = abs (q.xz) - 15.;
    q.y -= 0.1;
    d = min (length (q.xz) - 0.6, PrCylDf (q.xzy, 1., 0.1));
    DMINQ (idCol);
  }
  if (stLib >= 4) {
    qr = p;
    qr.xz = Rot2D (qr.xz, stAng);
    q = qr;
    q.xy = Rot2D (q.xy - vec2 (10., -10.), 0.25 * pi);
    s = mod (q.x, sqrt (2.));
    d = 0.5 * max (max (q.y - min (s, sqrt (2.) - s), abs (q.z) - 2.), -0.2 - q.y);
    DMINQ (idStr);
  }
  if (stLib >= 5) {
    q = qr;
    d = max (length (vec2 (r - 10.2, abs (q.y + 6.) - 1.3)) - 0.13, 2. - abs (qr.z));
    d = min (d, PrCylDf (vec3 (abs (q.x) - 10., q.y + 7.1, abs (q.z) - 2.).xzy, 0.25, 2.8));
    q.xz = Rot2D (q.xz, 2. * pi / 32.);
    a = (r > 0.) ? atan (q.z, - q.x) / (2. * pi) : 0.;
    q.xz = Rot2D (q.xz, 2. * pi * (floor (16. * a + 0.5) / 16.));
    d = min (d, PrCylDf ((q + vec3 (10.2, + 7.2, 0.)).xzy, 0.13, 2.5));
    q = qr;
    q.xy = Rot2D (q.xy, 0.25 * pi);
    d = min (d, max (length (vec2 (abs (q.y - 2.9) - 0.9, abs (q.z) - 2.)) - 0.13, abs (qr.x) - 10. ));
    q = qr;
    q.x += 20.;
    q.xy = Rot2D (q.xy, 0.25 * pi);
    d = min (d, max (length (vec2 (abs (q.y - 2.9) - 0.9, abs (q.z) - 2.)) - 0.13, abs (qr.x) - 10.));
    DMINQ (idRail);
  }
  if (stLib >= 6) {
    q = p;
    q.y -= -6.7;
    s = min (abs (q.x), abs (q.z));
    d = max (max (max (abs (r - 17.) - 1., abs (q.y) - 3.), 5. - s),
       - max (max (abs (r - 16.) - 1.5, abs (abs (q.y) - 1.4) - 1.2), 5.5 - s));
    DMINQ (idShlf);
  }
  if (stLib == 7 && q.y > 0. || stLib >= 8) {
    d = max (max (abs (r - 17.) - 0.5, abs (q.y) - 2.8), 5.2 - s);
    DMINQ (idBk);
  }
  if (stLib >= 2) {
    q = p;
    q.y -= 9.4;
    d = length (vec2 (r - 11., q.y)) - 0.3;
    q.xz = abs (q.xz) - 0.5 * bGrid.xz;
    d = min (d, PrCylDf (q.xzy, 2., 0.3));
    DMINQ (idLt);
  }
  return dMin;
}

void SetGConf ()
{
  stAng = 0.5 * pi * floor (4. * Hashfv2 (cId.xz + vec2 (27.1, 37.1)));
}

float ObjRay (vec3 ro, vec3 rd)
{
  vec3 p, rdi, s, cIdP;
  float dHit, d, eps;
  eps = 0.0005;
  if (rd.x == 0.) rd.x = 0.001;
  if (rd.y == 0.) rd.y = 0.001;
  if (rd.z == 0.) rd.z = 0.001;
  rdi = 1. / rd;
  cIdP = vec3 (-99.);
  dHit = eps;
  for (int j = VAR_ZERO; j < 220; j ++) {
    p = ro  + dHit * rd;
    cId = floor (p / bGrid);
    if (cId != cIdP) {
      SetGConf ();
      cIdP = cId;
    }
    d = ObjDf (p);
    s = (bGrid * (cId + step (0., rd)) - p) * rdi;
    d = min (d, abs (Minv3 (s)) + eps);
    dHit += d;
    if (d < eps || dHit > dstFar) break;
  }
  if (d >= eps) dHit = dstFar;
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

float ObjAO (vec3 ro, vec3 rd)
{
  vec3 p;
  float ao, d;
  ao = 0.;
  for (int j = VAR_ZERO; j < 4; j ++) {
    d = 0.1 + float (j) / 8.;
    p = ro + d * rd;
    cId = floor (p / bGrid);
    SetGConf ();
    ao += max (0., d - 3. * ObjDf (p));
  }
  return 0.5 + 0.5 * clamp (1. - 0.2 * ao, 0., 1.);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, bgCol, ltVec, roo, vn;
  vec2 vf;
  float dstObj, ltDist, ao, atten, r, s, a, y;
  int idObjT;
  bgCol = vec3 (0.05);
  roo = ro;
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    vf = vec2 (0.);
    if (idObj == idFlr || idObj == idShlf || idObj == idBk) {
      r = length (qHit.xz);
      a = (r > 0.) ? atan (qHit.z, - qHit.x) / pi + 0.5 : 0.;
    }
    if (idObj == idFlr) {
      s = length (abs (qHit.xz) - 20.);
      if (vn.y > 0.99) {
        col4 = vec4 (0.4, 0.2, 0.1, 0.1) * (1. - 0.3 * Fbm2 (2. * ro.xz));
        if (stLib >= 4) col4.rgb *= 0.5 + 0.5 * SmoothBump (0.03, 0.97, 0.01, mod (r, 1.));
        if (stLib >= 2) col4.rgb *= ((1. - 0.3 * smoothstep (1., 5., s)) +
           (1. - 0.3 * smoothstep (1., 5., r - 11.)));
        vf = vec2 (32., 1.);
      } else if (vn.y < -0.99) {
        col4 = vec4 (vec3 (0.8), -1.);
        if (stLib >= 3) col4.rgb *= (1. - 0.4 * smoothstep (3., 7., s)) *
           (1. - 0.4 * smoothstep (0., 4., r - 11.));
        else col4 = vec4 (vec3 (0.4), 0.1);
      } else {
        col4 = vec4 (0.3, 0.3, 0.7, 0.1);
        vf = vec2 (32., 1.);
      }
    } else if (idObj == idCol) {
      col4 = vec4 (0.7, 0.7, 0.6, 0.05);
      if (abs (vn.y) < 0.1) {
        vn.y += 0.1 * sin (2. * pi * 4. * qHit.y);
        vn = normalize (vn);
      }
      vf = vec2 (32., 1.);
    } else if (idObj == idRail) {
      col4 = vec4 (0.8, 0.8, 0.85, 0.2);
      vf = vec2 (32., 0.2);
    } else if (idObj == idStr) {
      if (abs (qHit.z) > 1.9) {
        col4 = vec4 (0.5, 0.55, 0.5, 0.1);
        vf = vec2 (32., 0.2);
      } else if (vn.y > -0.01) {
        col4 = vec4 (0.5, 0.3, 0.1, 0.1) * (1. - 0.2 * Fbm2 (2. * ro.xz));
        vf = vec2 (32., 0.2);
      } else {
        col4 = vec4 (0.6, 0.6, 0.6, -1.);
      }
    } else if (idObj == idShlf) {
      col4 = vec4 (vec3 (0.7, 0.4, 0.2) * (0.5 + 0.5 * Fbm2 ((r > 17.99) ?
         vec2 (128. * a, 0.5 * qHit.y) :
         ((abs (vn.y) < 0.01) ? vec2 (4. * r, 0.5 * qHit.y) : vec2 (32. * a, 4. * r)))), 0.1);
      vf = vec2 (32., 0.1);
      a = mod (4. * a + 0.5, 1.) - 0.5;
      if (stLib >= 7 && r > 17.99 && abs (a) < 0.07 && abs (qHit.y - 2.2) < 0.4) {
        if (ShowInt (vec2 (- 10. * a - 0.5, 0.8 * (qHit.y - 2.)), vec2 (1., 0.25), 4.,
           dot (mod (vec2 (66., 60.) + cId.xz, 100.), vec2 (100., 1.))) != 0.) 
           col4 = vec4 (0.2, 0.4, 1., -1.);
      }
    } else if (idObj == idBk) {
      a *= 128.;
      s = Hashfv2 (vec2 (floor (a), 1. + floor (qHit.y / 2.8)));
      y = mod (qHit.y / 2.8, 1.) / (0.9 - 0.3 * s);
      if (y < 1.) {
        a = mod (a, 1.);
        col4 = vec4 (HsvToRgb (vec3 (mod (Hashfv3 (cId) + 0.2 * s, 1.), 0.7,
           0.7 * (0.5 + 0.5 * SmoothBump (0.05, 0.95, 0.02, a)))), 0.1);
        col4.rgb = mix (mix (col4.rgb, vec3 (0.7, 0.7, 0.3), SmoothBump (0.2, 0.25, 0.01, y)),
           vec3 (0.8, 0.8, 0.2), step (abs (y - 0.5), 0.15) *
           step (abs (a - 0.5), 0.25) * step (0.5, Noisefv2 (cId.xz * vec2 (19., 31.) +
           floor (vec2 (16. * a, 16. * qHit.y)))));
        vn.xz = Rot2D (vn.xz, 0.5 * pi * (a - 0.5));
      } else {
        col4 = vec4 (0.1, 0.04, 0., -1.);
      }
    } else if (idObj == idLt) {
      col4 = (stLib >= 3) ? vec4 (vec3 (1., 1., 0.8) * (0.8 - 0.3 * vn.y), -1.) : vec4 (vec3 (0.8), 0.1);
    }
    ltVec = roo + ltPos - ro;
    ltDist = length (ltVec);
    ltVec /= ltDist;
    atten = 1.2 / (1. + 0.002 * pow (ltDist, 1.5));
    if (stLib <= 3 && ! isPano) atten *= 0.05 + 0.95 * smoothstep (0.7, 0.9, dot (ltAx, - ltVec));
    ao = 1.;
    if (stLib >= 2 && idObj != idBk) {
      idObjT = idObj;
      ao = ObjAO (ro, vn);
      idObj = idObjT;
    }
    if (stLib == 1) vf = vec2 (256., 2.);
    if (col4.a >= 0.) {
      if (vf.x > 0.) vn = VaryNf (vf.x * ro, vn, vf.y);
      col = col4.rgb * (0.2 + 0.8 * max (dot (vn, ltVec), 0.)) +
         col4.a * pow (max (dot (normalize (ltVec - rd), vn), 0.), 32.);
      if (idObj == idBk) col += 0.3 * col4.rgb * (0.6 - 0.4 * dot (normalize (vn.xz),
         normalize (qHit.xz)));
      col *= atten;
    } else col = col4.rgb * (0.2 + 0.8 * atten);
    col *= ao;
    col = clamp (mix (bgCol, col, exp (32. * min (0., 0.7 - dstObj / dstFar))), 0., 1.);
    col = mix (col, vec3 (1.) * Maxv3 (col), 0.2);
  } else col = bgCol;
  if (stLib <= 2) col = vec3 (0.95, 0.95, 1.) * Maxv3 (col);
  if (stLib == 1) col *= (tDir < 0.) ? vec3 (1., 0.2, 0.2) : vec3 (0.2, 1., 0.2);
  col = clamp (col, 0., 1.);
  if (! colImg) col = vec3 (0.95, 0.95, 1.) * pow (Maxv3 (col), 0.9);
  return col;
}

void mainImage (out vec4 fragColor, vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, col, colF[2];
  vec2 canvas, uv, ut;
  float az, el, asp, zmFac, phCyc, tc, t, mb;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  asp = canvas.x / canvas.y;
  bGrid = vec3 (40., 20., 40.);
  tc = 0.3 * tCur;
  colImg = true;
  isPano = (floor (mod ((tc + 9.5) / 9., 4.)) > 1.); //false;
  ut = vec2 (mPtr.x, abs (mPtr.y)) + 0.05 * vec2 (1. / asp, 1.) - 0.5;
  mb = min (ut.x, ut.y);
  if (mPtr.z > 0. && mb > 0.) {
    if (mPtr.y > 0.) isPano = ! isPano;
    else colImg = ! colImg;
  }
  az = 0.;
  el = 0.;
  if (mPtr.z > 0. && colImg && ! isPano && mb < 0.) {
    az += 2. * pi * mPtr.x;
    el += 0.7 * pi * mPtr.y;
  } else {
    t = 0.04 * tCur;
    az = 0.6 * pi * (mod (floor (t), 2.) - 0.5) * SmoothBump (0.25, 0.75, 0.15, mod (t, 1.));
  }
  el = clamp (el, -0.45 * pi, 0.45 * pi);
  vuMat = StdVuMat (el, az);
  ro = vuMat * vec3 (0., 0., -1.) + vec3 (0., 9., 4. * tCur);
  zmFac = isPano ? 0.5 : 1.6;
  ut = uv;
  uv /= zmFac;
  rd = vuMat * normalize (isPano ? vec3 (sin (uv.x + vec2 (0., 0.5 * pi)), uv.y).xzy : 
     vec3 (2. * tan (0.5 * atan (uv.x / asp)) * asp, uv.y, 1.));
  ltPos = vuMat * vec3 (0., 1., -1.);
  ltAx = vuMat * vec3 (0., 0., 1.);
  dstFar = 8. * bGrid.x;
  for (int k = VAR_ZERO; k < 2; k ++) {
    t = mod ((tc + float (k)) / 9., 2.);
    tDir = (2. * floor (t) - 1.) * (1. - abs (t - 1.));
    stLib = 9 - int (9. * abs (tDir));
    colF[k] = ShowScene (ro, rd);
  }
  col = mix (colF[0], colF[1], smoothstep (0.2, 0.8, fract (tc)));
  col *= 1. - step (5. * abs (mod ((tc + 0.5) / 9., 2.) - 1.),
     min (1.5, length (ut * vec2 (1. / asp, 1.))));
  if (mPtr.z > 0. && min (ut.x - asp, abs (ut.y) - 1.) > -0.1)
     col = mix (col, vec3 (1., 1., 0.), 0.3);
  fragColor = vec4 (col, 1.);
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
}

float Minv3 (vec3 p)
{
  return min (p.x, min (p.y, p.z));
}

float Maxv3 (vec3 p)
{
  return max (p.x, max (p.y, p.z));
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

vec3 HsvToRgb (vec3 c)
{
  return c.z * mix (vec3 (1.), clamp (abs (fract (c.xxx + vec3 (1., 2./3., 1./3.)) * 6. - 3.) - 1., 0., 1.), c.y);
}

const float cHashM = 43758.54;

float Hashfv2 (vec2 p)
{
  return fract (sin (dot (p, vec2 (37., 39.))) * cHashM);
}

float Hashfv3 (vec3 p)
{
  return fract (sin (dot (p, vec3 (37., 39., 41.))) * cHashM);
}

vec2 Hashv2v2 (vec2 p)
{
  vec2 cHashVA2 = vec2 (37., 39.);
  return fract (sin (dot (p, cHashVA2) + vec2 (0., cHashVA2.x)) * cHashM);
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
  vec2 e;
  e = vec2 (0.1, 0.);
  g = vec3 (Fbmn (p + e.xyy, n), Fbmn (p + e.yxy, n), Fbmn (p + e.yyx, n)) - Fbmn (p, n);
  return normalize (n + f * (g - n * dot (n, g)));
}

float DigSeg (vec2 q)
{
  return step (abs (q.x), 0.12) * step (abs (q.y), 0.6);
}

#define DSG(q) k = kk;  kk = k / 2;  if (kk * 2 != k) d += DigSeg (q)

float ShowDig (vec2 q, int iv)
{
  float d;
  int k, kk;
  const vec2 vp = vec2 (0.5, 0.5), vm = vec2 (-0.5, 0.5), vo = vec2 (1., 0.);
  if (iv == -1) k = 8;
  else if (iv < 2) k = (iv == 0) ? 119 : 36;
  else if (iv < 4) k = (iv == 2) ? 93 : 109;
  else if (iv < 6) k = (iv == 4) ? 46 : 107;
  else if (iv < 8) k = (iv == 6) ? 122 : 37;
  else             k = (iv == 8) ? 127 : 47;
  q = (q - 0.5) * vec2 (1.5, 2.2);
  d = 0.;
  kk = k;
  DSG (q.yx - vo);  DSG (q.xy - vp);  DSG (q.xy - vm);  DSG (q.yx);
  DSG (q.xy + vm);  DSG (q.xy + vp);  DSG (q.yx + vo);
  return d;
}

float ShowInt (vec2 q, vec2 cBox, float mxChar, float val)
{
  float nDig, idChar, s, sgn, v;
  q = vec2 (- q.x, q.y) / cBox;
  s = 0.;
  if (min (q.x, q.y) >= 0. && max (q.x, q.y) < 1.) {
    q.x *= mxChar;
    sgn = sign (val);
    val = abs (val);
    nDig = (val > 0.) ? floor (max (log (val) / log (10.), 0.) + 0.001) + 1. : 1.;
    idChar = mxChar - 1. - floor (q.x);
    q.x = fract (q.x);
    v = val / pow (10., mxChar - idChar - 1.);
    if (idChar == mxChar - nDig - 1. && sgn < 0.) s = ShowDig (q, -1);
    if (idChar >= mxChar - nDig) s = ShowDig (q, int (mod (floor (v), 10.)));
  }
  return s;
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 1., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}