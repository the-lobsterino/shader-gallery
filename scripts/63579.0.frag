/*
 * Original shader from: https://www.shadertoy.com/view/ldlBRM
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
// "Red Canyon 2" by dr2 - 2017
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

float PrCylDf (vec3 p, float r, float h);
float PrCapsDf (vec3 p, float r, float h);
float PrFlatCylDf (vec3 p, float rhi, float rlo, float h);
float Noisefv2 (vec2 p);
float Noisefv3a (vec3 p);
float Fbm3 (vec3 p);
vec3 VaryNf (vec3 p, vec3 n, float f);
float SmoothMin (float a, float b, float r);
float SmoothMax (float a, float b, float r);
float SmoothBump (float lo, float hi, float w, float x);
mat3 AxToRMat (vec3 vz, vec3 vy);
vec2 Rot2D (vec2 q, float a);

#define N_FLYER 3

int idObj = 0, idFlmGrp = 0, idLsrGrp = 0;
mat3 flyerMat[N_FLYER], flMat = mat3(0.);
vec3 flyerPos[N_FLYER], flPos = vec3(0.), qHit = vec3(0.), qHitFlm = vec3(0.), qHitLsr = vec3(0.), sunDir = vec3(0.), flmCylPos = vec3(0.), lsrCylPos = vec3(0.),
   trkF = vec3(0.), trkA = vec3(0.);
float dstFar = 0., tCur = 0., fusLen = 0., flmCylRad = 0., flmCylLen = 0., lsrCylRad = 0., lsrCylLen = 0., vFly = 0.;
const int idFus = 11, idEngO = 12, idEngI = 13, idWng = 14, idCan = 15;
const float pi = 3.14159;

vec3 SkyBg (vec3 rd)
{
  return mix (vec3 (0.2, 0.2, 0.9), vec3 (0.4, 0.4, 0.55),
     1. - max (rd.y, 0.));
}

vec3 SkyCol (vec3 ro, vec3 rd)
{
  vec3 p, q, cSun, clCol, col;
  float fCloud, cloudLo, cloudRngI, atFac, colSum, attSum, s,
     att, a, dDotS, ds;
  const int nLay = 60;
  cloudLo = 200.;  cloudRngI = 1./200.;  atFac = 0.035;
  fCloud = 0.45;
  if (rd.y > 0.) {
    fCloud = clamp (fCloud, 0., 1.);
    dDotS = max (dot (rd, sunDir), 0.);
    ro.x += 3. * tCur;
    p = ro;
    p.xz += (cloudLo - p.y) * rd.xz / rd.y;
    p.y = cloudLo;
    ds = 1. / (cloudRngI * rd.y * (2. - rd.y) * float (nLay));
    colSum = 0.;  attSum = 0.;
    s = 0.;  att = 0.;
    for (int j = 0; j < nLay; j ++) {
      q = p + rd * s;
      att += atFac * max (fCloud - Fbm3 (0.007 * q), 0.);
      a = (1. - attSum) * att;
      colSum += a * (q.y - cloudLo) * cloudRngI;
      attSum += a;  s += ds;
      if (attSum >= 1.) break;
    }
    colSum += 0.5 * min ((1. - attSum) * pow (dDotS, 3.), 1.);
    clCol = vec3 (1.) * 2.8 * (colSum + 0.05);
    cSun = vec3 (1.) * clamp ((min (pow (dDotS, 1500.) * 2., 1.) +
       min (pow (dDotS, 10.) * 0.75, 1.)), 0., 1.);
    col = clamp (mix (SkyBg (rd) + cSun, clCol, attSum), 0., 1.);
    col = mix (col, SkyBg (rd), pow (1. - rd.y, 16.));
  } else col = SkyBg (rd);
  return col;
}

float GrndDf (vec3 p)
{
  float d, s;
  s = p.y - 3.;
  d = SmoothMin (12. + 4. * sin (0.019 * p.z) -
     abs (p.x - dot (trkA, sin (trkF * p.z))) +
     s * (0.3 - 0.05 * s), 3. + p.y, 2.);
  d = SmoothMax (d, - (8. + 1.1 * sin (0.022 * p.z) - p.y), 1.);
  d += 2.3 * Noisefv2 (0.2 * p.xz) + 1.1 * Noisefv2 (0.6 * p.xz) +
     0.3 * Noisefv2 (1.1 * p.xz);
  return d;
}

float GrndRay (vec3 ro, vec3 rd)
{
  vec3 p;
  float dHit, h, s, sLo, sHi;
  s = 0.;
  sLo = 0.;
  dHit = dstFar;
  for (int j = 0; j < 150; j ++) {
    p = ro + s * rd;
    h = GrndDf (p);
    if (h < 0.) break;
    sLo = s;
    s += 0.5 * h + 0.005 * s;
    if (s > dstFar) break;
  }
  if (h < 0.) {
    sHi = s;
    for (int j = 0; j < 4; j ++) {
      s = 0.5 * (sLo + sHi);
      p = ro + s * rd;
      h = step (0., GrndDf (p));
      sLo += h * (s - sLo);
      sHi += (1. - h) * (s - sHi);
    }
    dHit = sHi;
  }
  return dHit;
}

vec3 GrndNf (vec3 p)
{
  vec3 e;
  float s;
  e = vec3 (0.01, 0., 0.);
  s = GrndDf (p);
  return normalize (vec3 (GrndDf (p + e.xyy) - s, e.x,
     GrndDf (p + e.yyx) - s));
}

vec4 GrndCol (vec3 p, vec3 n)
{
  vec4 col, wCol, bCol;
  wCol = mix (vec4 (0.5, 0.4, 0.4, 1.), vec4 (0.22, 0.2, 0.2, 1.),
     clamp (1.4 * (Noisefv2 (5. * p.xy +
     vec2 (0., 3.7 * sin (0.17 * p.z))) +
     Noisefv2 (p.zy * vec2 (5., 10.3))) - 1., 0., 1.));
  bCol = mix (vec4 (0.2, 0.4, 0.2, 0.), vec4 (0.2, 0.2, 0., 0.),
     clamp (Noisefv2 (2. * p.xz) - 0.3, 0., 1.));
  col = mix (wCol, bCol, smoothstep (0.6, 0.9, n.y));
  col.w *= clamp (1. - 2. * n.y, 0., 1.);
  return col;
}

float GrndSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 1.;
  for (int j = 0; j < 16; j ++) {
    h = GrndDf (ro + rd * d);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += 1.;
    if (sh < 0.05) break;
  }
  return sh;
}

float FlmDf (vec3 p)
{
  vec3 q, qq;
  float d, dMin, r, s;
  dMin = dstFar;
  s = (0.55 / sqrt (2.)) * fusLen;
  for (int k = 0; k < N_FLYER; k ++) {
    q = flyerMat[k] * (p - flyerPos[k]) - flmCylPos;
    r = flmCylRad * (0.6 + 0.4 * q.z / flmCylLen);
    qq = q + vec3 (s, s, 0.);
    d = PrCylDf (qq, r, flmCylLen);
    if (d < dMin) { dMin = d;  qHitFlm = qq;  idFlmGrp = k; }
    qq = q + vec3 (s, - s, 0.);
    d = PrCylDf (qq, r, flmCylLen);
    if (d < dMin) { dMin = d;  qHitFlm = qq;  idFlmGrp = k; }
    qq = q + vec3 (- s, - s, 0.);
    d = PrCylDf (qq, r, flmCylLen);
    if (d < dMin) { dMin = d;  qHitFlm = qq;  idFlmGrp = k; }
    qq = q + vec3 (- s, s, 0.);
    d = PrCylDf (qq, r, flmCylLen);
    if (d < dMin) { dMin = d;  qHitFlm = qq;  idFlmGrp = k; }
  }
  return dMin;
}

float FlmRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 50; j ++) {
    d = FlmDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.001 || dHit > dstFar) break;
  }
  if (d >= 0.001) dHit = dstFar;
  return dHit;
}

float LsrDf (vec3 p)
{
  vec3 q;
  float d, dMin;
  dMin = dstFar;
  for (int k = 0; k < N_FLYER; k ++) {
    q = flyerMat[k] * (p - flyerPos[k]);
    q -= lsrCylPos;
    d = PrCylDf (q, lsrCylRad, lsrCylLen);
    if (d < dMin) { dMin = d;  qHitLsr = q;  idLsrGrp = k; }
    q.x += 2. * lsrCylPos.x;
    d = PrCylDf (q, lsrCylRad, lsrCylLen);
    if (d < dMin) { dMin = d;  qHitLsr = q;  idLsrGrp = k; }
  }
  return dMin;
}

float LsrRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 50; j ++) {
    d = LsrDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.001 || dHit > dstFar) break;
  }
  if (d >= 0.001) dHit = dstFar;
  return dHit;
}

float FlyerDf (vec3 p)
{
  vec3 q;
  float dMin, d, wr, ws;
  dMin = dstFar / 0.8;
  p.z -= 0.4 * fusLen;
  q = p;
  q.xy = Rot2D (q.xy, pi / 4.);
  wr = 0.6 + q.z / fusLen;
  wr = (0.14 - 0.1 * wr * wr) * fusLen;
  q.z -= 0.3 * fusLen;
  d = min (PrCapsDf (q * vec3 (0.7, 1., 0.7), wr, fusLen),
     PrCapsDf (q * vec3 (1., 0.7, 0.7), wr, fusLen));
  q.z += 0.3 * fusLen;
  d = SmoothMin (d, PrCapsDf (q, 0.1 * fusLen, 0.5 * fusLen), 0.01 * fusLen);
  if (d < dMin) { dMin = d;  idObj = idFus;  qHit = q; }
  q = p;
  q.xy = Rot2D (q.xy, 2. * pi *
     (floor (4. * atan (q.y, - q.x) / (2. * pi)) + 0.5) / 4.);
  q.xz -= vec2 (-0.55, -0.8) * fusLen;
  ws = q.z / (0.4 * fusLen);
  wr = ws - 0.1;
  d = max (PrCylDf (q, (0.09 - 0.05 * wr * wr) * fusLen, 0.35 * fusLen),
     - PrCylDf (q, 0.05 * fusLen, 0.36 * fusLen));
  if (d < dMin) { dMin = d;  idObj = idEngO;  qHit = q; }
  d = min (PrCylDf (q, (0.04 - 0.038 * ws * ws) * fusLen, 0.38 * fusLen),
     PrCylDf (q - vec3 (0., 0., 0.03 * fusLen), 0.05 * fusLen, 0.28 * fusLen));
  if (d < dMin) { dMin = d;  idObj = idEngI;  qHit = q; }
  q.xz -= vec2 (0.3, -0.05) * fusLen;
  q.xz = Rot2D (q.xz, 0.05 * pi);
  d = PrFlatCylDf (q.zyx, 0.2, 0.01, 0.27) * fusLen;
  if (d < dMin) { dMin = d;  idObj = idWng;  qHit = q; }
  q = p;
  q.x = abs (q.x);
  q.xz -= fusLen * vec2 (0.1, 0.2);
  d = PrFlatCylDf (q.zyx, 0.03 * fusLen, 0.01 * fusLen, 0.1 * fusLen);
  q.x -= 0.1 * fusLen;
  d = min (d, PrCapsDf (q, 0.02 * fusLen, 0.1 * fusLen));
  if (d < dMin) { dMin = d;  idObj = idCan;  qHit = q; }
  return 0.8 * dMin;
}

float ObjDf (vec3 p)
{
  float dMin;
  dMin = dstFar;
  for (int k = 0; k < N_FLYER; k ++) {
    dMin = min (dMin, FlyerDf (flyerMat[k] * (p - flyerPos[k])));
  }
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  vec3 rom[N_FLYER], rdm[N_FLYER], qHitF;
  float dHit, d, df;
  int idObjF;
  for (int k = 0; k < N_FLYER; k ++) {
    rom[k] = flyerMat[k] * (ro - flyerPos[k]);
    rdm[k] = flyerMat[k] * rd;
  }
  dHit = 0.;
  for (int j = 0; j < 120; j ++) {
    df = dstFar;
    for (int k = 0; k < N_FLYER; k ++) {
      d = FlyerDf (rom[k] + dHit * rdm[k]);
      if (d < df) {
        df = d;
        qHitF = qHit;
        idObjF = idObj;
      }
    }
    dHit += df;
    if (df < 0.001 || dHit > dstFar) break;
  }
  if (df >= 0.001) dHit = dstFar;
  else {
    qHit = qHitF;
    idObj = idObjF;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  const vec3 e = vec3 (0.001, -0.001, 0.);
  v = vec4 (ObjDf (p + e.xxx), ObjDf (p + e.xyy),
     ObjDf (p + e.yxy), ObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

float ObjSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 0.05;
  for (int j = 0; j < 16; j ++) {
    h = ObjDf (ro + rd * d);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += 0.1;
    if (sh < 0.05) break;
  }
  return sh;
}

vec4 FlyerCol ()
{
  vec3 qq, col;
  float spec, br;
  spec = 1.;
  qq = qHit / fusLen;
  br = 0.4 + 0.6 * abs (cos (3. * tCur));
  col = vec3 (0.9);
  if (idObj == idFus) {
    qq.xy = Rot2D (qq.xy, - pi / 4.);
    if (qq.y > 0.) col *= 0.7;
  } else if (idObj == idWng) {
    if (abs (qq.x + 0.05) < 0.115)
       col *= 1. - SmoothBump (-0.005, 0.005, 0.001, qq.z + 0.17);
    if (qq.z < -0.17)
       col *= 1. - SmoothBump (- 0.005, 0.005, 0.001,
       abs (abs (qq.x + 0.05) - 0.26) - 0.15);

  } else if (idObj == idEngO) {
    if (qq.z > 0.34) {
      col = vec3 (0.8, 0.8, 1.);
    } else if (qq.z < -0.2 && length (qq.xy) < 0.05) {
      col = vec3 (1., 0.3, 0.);
      spec = 0.1;
    }
  } else if (idObj == idEngI) {
    if (qq.z > 0.36) col = vec3 (1., 0., 0.);
    else if (qq.z < 0.) {
      col = vec3 (1., 0.3, 0.);
      spec = 0.1;
    } else {
      col = vec3 (0.01);
    }
  } else if (idObj == idCan) {
    col *= 0.5;
  }
  if (idObj == idFus) {
    if (qq.z > 0.5) {
      if (length (qq.xy) < 0.01) {
        col = vec3 (0., 1., 0.) * br;
        spec = -1.;
      } else if (min (abs (qq.x), abs (qq.y)) > 0.01 && abs (qq.z - 0.52) > 0.007) {
        col = vec3 (0.4, 0.2, 0.1);
        spec = 0.2;
      }
    } else if (qq.z < -1.2 && length (qq.xy) < 0.03) {
      col = vec3 (1., 0., 0.) * br;
      spec = -1.;
    }
  }
  return vec4 (col, spec);
}

float FlmAmp (vec3 p, vec3 rd)
{
  vec3 dp, q;
  float g, s, fr, fz;
  dp = (2. * flmCylRad / 30.) * rd;
  g = 0.;
  for (int i = 0; i < 30; i ++) {
    p += dp;
    s = length (p.xy);
    if (s > flmCylRad || g > 10.) break;
    fr = max (1. - s / flmCylRad, 0.);
    fz = 0.6 + 0.4 * p.z / flmCylLen;
    q = 5. * p / fusLen;
    g += fr * fz * Noisefv3a (vec3 (q.xy, q.z +
       50. * (1. - 0.5 * fr) * (100. + tCur)));
  }
  return min (0.15 * g, 1.);
}

float LsrAmp (vec3 p, vec3 rd)
{
  float g;
  g = smoothstep (0., 0.2, abs (dot (normalize (p.xy), - rd.xy))) *
     smoothstep (0.3, 0.4, mod (23. * p.z / fusLen - 10. * tCur, 1.)) *
     step (0.2, mod (0.7 * tCur, 1.));
  return g;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 objCol;
  vec3 col, vn, rdm;
  float dstHit, dstGrnd, dstFlm, aFlm, dstLsr, aLsr, sh;
  bool isGrnd;
  flmCylRad = 0.051 * fusLen;
  flmCylLen = 0.5 * fusLen;
  flmCylPos = vec3 (0., 0., -0.55 * fusLen - flmCylLen);
  lsrCylRad = 0.005 * fusLen;
  lsrCylLen = 5. * fusLen;
  lsrCylPos = vec3 (0.2 * fusLen, 0., 1.12 * lsrCylLen);
  dstFlm = FlmRay (ro, rd);
  dstLsr = LsrRay (ro, rd);
  dstHit = ObjRay (ro, rd);
  dstGrnd = GrndRay (ro, rd);
  if (dstHit < dstFlm) dstFlm = dstFar;
  if (dstHit < dstLsr) dstLsr = dstFar;
  isGrnd = false;
  if (dstHit < dstGrnd) {
    ro += rd * dstHit;
    objCol = FlyerCol ();
    vn = ObjNf (ro);
    if (objCol.a >= 0.) {
      sh = 0.1 + 0.9 * ObjSShadow (ro, sunDir);
      col = objCol.rgb * 0.7 * (0.2 + sh * 0.8 * max (dot (vn, sunDir), 0.)) +
         0.3 * SkyCol (ro, reflect (rd, vn)) +
         vec3 (1.) * sh * objCol.a *
         pow (max (dot (normalize (sunDir - rd), vn), 0.), 256.);
    } else col = objCol.rgb;
  } else {
    dstHit = dstGrnd;
    if (dstHit < dstFar) {
      ro += dstGrnd * rd;
      isGrnd = true;
    } else col = SkyCol (ro, rd);
  }
  if (isGrnd) {
    vn = VaryNf (5. * ro, GrndNf (ro), 5.);
    objCol = GrndCol (ro, vn);
    sh = 0.2 + 0.8 * GrndSShadow (ro, sunDir);
    col = objCol.rgb * (0.1 + 0.2 * max (vn.y, 0.) +
       sh * 0.9 * max (dot (vn, sunDir), 0.)) +
       vec3 (1.) * sh * objCol.a *
       pow (max (dot (normalize (sunDir - rd), vn), 0.), 256.);
  }
  if (dstFlm < min (dstFar, dstHit)) {
    rdm = (idFlmGrp == 0) ? flyerMat[0] * rd :
       ((idFlmGrp == 1) ? flyerMat[1] * rd : flyerMat[2] * rd);
    aFlm = FlmAmp (qHitFlm, rdm);
    col = mix (col, mix (vec3 (1., 0.2, 0.2),
       vec3 (1., 1., 0.7), 0.8 * aFlm), aFlm);
  }
  if (dstLsr < min (dstFar, dstHit)) {
    rdm = (idLsrGrp == 0) ? flyerMat[0] * rd :
       ((idLsrGrp == 1) ? flyerMat[1] * rd : flyerMat[2] * rd);
    aLsr = LsrAmp (qHitLsr, rdm);
    col = mix (col, vec3 (1., 0.7, 0.2), aLsr);
  }
  if (dstHit < dstFar)
     col = mix (col, 0.7 * SkyBg (rd), clamp (pow (dstGrnd / dstFar, 4.), 0., 1.));
   col = pow (clamp (col, 0., 1.), vec3 (0.8));
  return col;
}

mat3 EvalOri (vec3 v, vec3 a)
{
  vec3 g, w;
  float f, c, s;
  v = normalize (v);
  g = cross (v, vec3 (0., 1., 0.));
  if (g.y != 0.) {
    g.y = 0.;
    w = normalize (cross (g, v));
  } else w = vec3 (0., 1., 0.);
  f = v.z * a.x - v.x * a.z;
  f = - clamp (30. * f, -0.3 * pi, 0.3 * pi);
  c = cos (f);
  s = sin (f);
  return mat3 (c, - s, 0., s, c, 0., 0., 0., 1.) * AxToRMat (v, w);
}

void FlyerPM (float t, float vu)
{
  vec3 v, s;
  t *= vFly;
  s = sin (trkF * t);
  flPos = vec3 (dot (trkA, s), 0., t);
  v = vec3 (dot (trkF * trkA, cos (trkF * t)), 0., 1.);
  if (vu > 0.) v.xz *= -1.;
  flMat = EvalOri (v, vec3 (- dot (trkF * trkF * trkA, s), 0., 0.));
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd;
  vec2 canvas, uv, ori, ca, sa;
  float tGap, el, az, zmFac, vuPeriod, dVu, lookDir, t;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  tCur += 50.;
  sunDir = normalize (vec3 (cos (0.031 * tCur), 0.5, sin (0.031 * tCur)));
  trkF = vec3 (0.029, 0.021, 0.016);
  trkA = vec3 (15., 23., 34.);
  fusLen = 1.;
  vuPeriod = 60.;
  vFly = 15.;
  tGap = 16. / vFly;
  for (int k = 0; k < N_FLYER; k ++) {
    FlyerPM (tCur + (0.5 + float (k)) * tGap, 0.);
    flyerPos[k] = flPos;  flyerMat[k] = flMat;
  }
  t = mod (tCur / vuPeriod + 0.25, 1.);
  lookDir = 2. * floor (2. * t) - 1.;
  dVu = 2. * SmoothBump (0.25, 0.75, 0.1, t) - 1.;
  FlyerPM (tCur + tGap * 0.5 * float (N_FLYER) * (1. + 0.8 * dVu), lookDir);
  ro = flPos;
  ro.y += 0.8 * fusLen + 0.3 * (1. + sin (0.02 * ro.z));
  az = 0.;
  el = -0.1 * pi;
  if (mPtr.z > 0.) {   
    az = 2. * pi * mPtr.x;
    el = pi * mPtr.y;
  }
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  vuMat = mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
          mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
  zmFac = 1.5;
  rd = vuMat * normalize (vec3 (uv, zmFac));
  rd = rd * flMat;
  dstFar = 250.;
  fragColor = vec4 (ShowScene (ro, rd), 1.);
}

float PrCapsDf (vec3 p, float r, float h)
{
  return length (p - vec3 (0., 0., h * clamp (p.z / h, -1., 1.))) - r;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float PrFlatCylDf (vec3 p, float rhi, float rlo, float h)
{
  return max (length (p.xy - vec2 (rhi *
     clamp (p.x / rhi, -1., 1.), 0.)) - rlo, abs (p.z) - h);
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

vec4 Hashv4v3 (vec3 p)
{
  const vec3 cHashVA3 = vec3 (37.1, 61.7, 12.4);
  const vec3 e = vec3 (1., 0., 0.);
  return fract (sin (vec4 (dot (p + e.yyy, cHashVA3), dot (p + e.xyy, cHashVA3),
     dot (p + e.yxy, cHashVA3), dot (p + e.xxy, cHashVA3))) * cHashM);
}

float Noisefv3a (vec3 p)
{
  vec3 i, f;
  i = floor (p);  f = fract (p);
  f *= f * (3. - 2. * f);
  vec4 t1 = Hashv4v3 (i);
  vec4 t2 = Hashv4v3 (i + vec3 (0., 0., 1.));
  return mix (mix (mix (t1.x, t1.y, f.x), mix (t1.z, t1.w, f.x), f.y),
              mix (mix (t2.x, t2.y, f.x), mix (t2.z, t2.w, f.x), f.y), f.z);
}

float Fbm3 (vec3 p)
{
  const mat3 mr = mat3 (0., 0.8, 0.6, -0.8, 0.36, -0.48, -0.6, -0.48, 0.64);
  float f, a, am, ap;
  f = 0.;  a = 0.5;
  am = 0.5;  ap = 4.;
  p *= 0.5;
  for (int i = 0; i < 6; i ++) {
    f += a * Noisefv3a (p);
    p *= mr * ap;  a *= am;
  }
  return f;
}

float Fbmn (vec3 p, vec3 n)
{
  vec3 s;
  float a;
  s = vec3 (0.);
  a = 1.;
  for (int i = 0; i < 5; i ++) {
    s += a * vec3 (Noisefv2 (p.yz), Noisefv2 (p.zx), Noisefv2 (p.xy));
    a *= 0.5;
    p *= 2.;
  }
  return dot (s, abs (n));
}

vec3 VaryNf (vec3 p, vec3 n, float f)
{
  vec3 g;
  const vec3 e = vec3 (0.1, 0., 0.);
  g = vec3 (Fbmn (p + e.xyy, n), Fbmn (p + e.yxy, n),
     Fbmn (p + e.yyx, n)) - Fbmn (p, n);
  return normalize (n + f * (g - n * dot (n, g)));
}

mat3 AxToRMat (vec3 vz, vec3 vy)
{
  vec3 vx;
  vx = normalize (cross (vy, vz));
  vy = cross (vz, vx);
  return mat3 (vec3 (vx.x, vy.x, vz.x), vec3 (vx.y, vy.y, vz.y),
     vec3 (vx.z, vy.z, vz.z));
}

vec2 Rot2D (vec2 q, float a)
{
  return q * cos (a) + q.yx * sin (a) * vec2 (-1., 1.);
}

float SmoothMin (float a, float b, float r)
{
  float h;
  h = clamp (0.5 + 0.5 * (b - a) / r, 0., 1.);
  return mix (b, a, h) - r * h * (1. - h);
}

float SmoothMax (float a, float b, float r)
{
  return - SmoothMin (- a, - b, r);
}

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}