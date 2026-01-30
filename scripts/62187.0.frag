/*
 * Original shader from: https://www.shadertoy.com/view/wsXyzM
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
// "Moebius, Menger, Spiders" by dr2 - 2020
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

#define VAR_ZERO 0

float PrBoxDf (vec3 p, vec3 b);
float PrSphDf (vec3 p, float s);
float PrCylDf (vec3 p, float r, float h);
float PrEETapCylDf (vec3 p, vec3 v1, vec3 v2, float r, float rf);
float PrEllipsDf (vec3 p, vec3 r);
vec3 VaryNf (vec3 p, vec3 n, float f);
float SmoothBump (float lo, float hi, float w, float x);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);

vec3 footPos[8], kneePos[8], hipPos[8], ltDir = vec3(0.), qHit = vec3(0.);
float dstFar = 0., tCur = 0., mobRad = 0., legLenU = 0., legLenD = 0., bdyHt = 0., spdVel = 0., nSpd = 0.;
int idObj = 0;
const int idMob = 1, idBdy = 11, idHead = 12, idEye = 13, idAnt = 14, idLegU = 15, idLegD = 16;
const float pi = 3.14159;

#define DMINQ(id) if (d < dMin) { dMin = d;  idObj = id;  qHit = q; }

float MobiusDf (vec3 p)
{
  vec3 b;
  float sclFac, r, a;
  const int nIt = 4;
  sclFac = 2.6;
  b = (sclFac - 1.) * vec3 (1., 1.125, 0.625);
  r = length (p.xz);
  a = (r > 0.) ? atan (p.z, - p.x) / (2. * pi) : 0.;
  p = vec3 (mod (16. * a + 1., 2.) - 1., Rot2D (vec2 (p.y, r - 32. / (2. * pi)), pi * a));
  for (int n = VAR_ZERO; n < nIt; n ++) {
    p = abs (p);
    p.xy = (p.x > p.y) ? p.xy : p.yx;
    p.xz = (p.x > p.z) ? p.xz : p.zx;
    p.yz = (p.y > p.z) ? p.yz : p.zy;
    p = sclFac * p - b;
    p.z += b.z * step (p.z, -0.5 * b.z);
  }
  return 0.9 * PrBoxDf (p, vec3 (1.)) / pow (sclFac, float (nIt));
}

float SpdDf (vec3 p, float dMin, int tpId)
{
  vec3 q;
  float d, s, len, szFac;
  szFac = 0.2;
  p /= szFac;
  dMin /= szFac; 
  p.y -= bdyHt + 0.7;
  q = p - vec3 (0., -0.15, 0.2);
  d = PrEllipsDf (q, vec3 (0.7, 0.5, 1.3));
  DMINQ (idBdy + tpId);
  q = p - vec3 (0., 0.1, 1.1);
  d = PrEllipsDf (q, vec3 (0.2, 0.4, 0.5));
  DMINQ (idHead + tpId);
  q = p;
  q.x = abs (q.x);
  q -= vec3 (0.15, 0.25, 1.5);
  d = PrSphDf (q, 0.13);
  DMINQ (idEye + tpId);
  q -= vec3 (0., 0.15, -0.3);
  d = PrEETapCylDf (q, 1.3 * vec3 (0.3, 1.1, 0.4), vec3 (0.), 0.07, 0.7);
  DMINQ (idAnt + tpId);
  p.y += bdyHt;
  for (int j = VAR_ZERO; j < 8; j ++) {
    q = p - hipPos[j];
    d = 0.6 * PrEETapCylDf (q, kneePos[j], hipPos[j], 0.25, 0.3);
    DMINQ (idLegU + tpId);
    q = p - kneePos[j];
    d = 0.6 * PrEETapCylDf (q, footPos[j] - vec3 (0.3), kneePos[j] - vec3 (0.3), 0.2, 1.2);
    DMINQ (idLegD + tpId);
  }
  dMin *= szFac;
  return dMin;
}

float ObjDf (vec3 p)
{
  vec3 q = vec3(0.);
  float dMin, d, a, aq, na;
  dMin = dstFar;
  d = MobiusDf (p);
  DMINQ (idMob);
  q = p;
  a = tCur * spdVel / (2. * pi * mobRad);
  q.xz = Rot2D (q.xz, a);
  na = floor (nSpd * atan (q.z, - q.x) / (2. * pi));
  aq = 2. * pi * (na + 0.5) / nSpd;
  q.xz = Rot2D (q.xz, aq);
  q.x += mobRad;
  a += aq;
  if (2. * floor (0.5 * na) != na) a += 2. * pi;
  q.xy = Rot2D (q.xy, 0.5 * a);
  q.y -= 0.8;
  if (PrCylDf (q.xzy, 1., 0.7) < dMin) dMin = SpdDf (q, dMin, 0);
  q = p;
  a = - tCur * spdVel / (2. * pi * mobRad);
  q.xz = Rot2D (q.xz, a);
  na = floor (nSpd * atan (q.z, - q.x) / (2. * pi));
  aq = 2. * pi * (na + 0.5) / nSpd;
  q.xz = Rot2D (q.xz, aq);
  q.x += mobRad;
  a += aq;
  if (2. * floor (0.5 * na) != na) a += 2. * pi;
  q.xy = Rot2D (q.xy, 0.5 * a + 0.5 * pi);
  q.y -= 0.8;
  if (PrCylDf (q.xzy, 1., 0.7) < dMin) dMin = SpdDf (vec3 (- q.xz, q.y).xzy, dMin, 10);
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = VAR_ZERO; j < 160; j ++) {
    d = ObjDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.0001 || dHit > dstFar) break;
  }
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
  for (int j = VAR_ZERO; j < 20; j ++) {
    h = ObjDf (ro + d * rd);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += h;
    if (sh < 0.05) break;
  }
  return 0.4 + 0.6 * sh;
}

void SpdSetup (float gDisp)
{
  vec3 v;
  float a, az, fz, d, ll;
  nSpd = 10.;
  for (int j = VAR_ZERO; j < 4; j ++) {
    a = 0.2 * (1. + float (j)) * pi;
    hipPos[j] = 0.5 * vec3 (- sin (a), 0., 1.5 * cos (a));
    hipPos[j + 4] = hipPos[j];
    hipPos[j + 4].x *= -1.;
  }
  bdyHt = 1.5;
  legLenU = 2.2;
  legLenD = 3.;
  ll = legLenD * legLenD - legLenU * legLenU;
  for (int j = VAR_ZERO; j < 8; j ++) {
    fz = fract ((gDisp + 0.93 + ((j < 4) ? -1. : 1.) + mod (7. - float (j), 4.)) / 3.);
    az = smoothstep (0.7, 1., fz);
    footPos[j] = 5. * hipPos[j];
    footPos[j].x *= 1.7;
    footPos[j].y += 0.7 * sin (pi * clamp (1.4 * az - 0.4, 0., 1.));
    footPos[j].z += ((j < 3) ? 0.5 : 1.) - 3. * (fz - az);
    hipPos[j] += vec3 (0., bdyHt - 0.3, 0.2);
    v = footPos[j] - hipPos[j];
    d = length (v);
    a = asin ((hipPos[j].y - footPos[j].y) / d);
    kneePos[j].y = footPos[j].y + legLenD *
       sin (acos ((d * d + ll) / (2. * d *  legLenD)) + a);
    kneePos[j].xz = hipPos[j].xz + legLenU * sin (acos ((d * d - ll) /
       (2. * d *  legLenU)) + 0.5 * pi - a) * normalize (v.xz);
  }
}

vec3 SpdCol (vec3 vn)
{
  vec3 col, c1, c2;
  if (idObj >= idBdy + 10) {
    idObj -= 10;
    c1 = vec3 (0.5, 1., 0.2);
    c2 = vec3 (0.5, 0.2, 0.2);
  } else {
    c1 = vec3 (1., 0.5, 0.2);
    c2 = vec3 (0.2, 0.2, 0.5);
  }
  if (idObj == idBdy) {
    col = mix (c1, c2, SmoothBump (0.2, 0.7, 0.05, mod (4. * qHit.z, 1.)));
  } else if (idObj == idHead) {
    col = c2;
    if (qHit.z > 0.4) col = mix (vec3 (0.2, 0.05, 0.05), col,
       smoothstep (0.02, 0.04, abs (qHit.x)));
  } else if (idObj == idEye) {
    col = (vn.z < 0.6) ? vec3 (0., 1., 0.) : c1;
  } else if (idObj == idLegU || idObj == idLegD) {
    col = mix (c2, c1,  SmoothBump (0.4, 1., 0.2, fract (3.5 * length (qHit))));
  } else if (idObj == idAnt) {
    col = vec3 (1., 1., 0.3);
  }
  return col;
}

vec3 BgCol (vec3 rd)
{
  float t, gd, b;
  t = tCur * 1.5;
  b = dot (vec2 (atan (rd.x, rd.z), 0.5 * pi - acos (rd.y)), vec2 (2., sin (rd.x)));
  gd = clamp (sin (5. * b + t), 0., 1.) * clamp (sin (3.5 * b - t), 0., 1.) +
     clamp (sin (21. * b - t), 0., 1.) * clamp (sin (17. * b + t), 0., 1.);
  return mix (vec3 (0.35, 0.5, 1.), vec3 (0.1, 0.4, 0.3), 0.5 * (1. - rd.y)) *
     (0.24 + 0.44 * (rd.y + 1.) * (rd.y + 1.)) * (1. + 0.15 * gd);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 vn, col;
  float dstObj, sh;
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += rd * dstObj;
    vn = ObjNf (ro);
    if (idObj == idMob) {
      col4 = vec4 (0.6, 0.6, 0.7, 0.1);
      vn = VaryNf (32. * ro, vn, 1.);
    } else if (idObj >= idBdy) {
      col4 = vec4 (SpdCol (vn), 1.);
    }
    sh = ObjSShadow (ro, ltDir);
    col = col4.rgb * (0.2 + 0.2 * max (- dot (vn, ltDir), 0.) +
       0.8 * sh * max (dot (vn, ltDir), 0.)) +
       step (0.95, sh) * col4.a * pow (max (0., dot (ltDir, reflect (rd, vn))), 32.);
    col = mix (col, BgCol (reflect (rd, vn)), 0.3);
  } else col = BgCol (rd);
  return clamp (col, 0., 1.);
}

#define AA  0  // optional antialiasing

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, col;
  vec2 canvas, uv;
  float el, az, zmFac, t, sr;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  az = 0.;
  el = 0.;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += pi * mPtr.y;
  } else {
    t = (floor (0.3 * tCur) + smoothstep (0.8, 1., mod (0.3 * tCur, 1.)));
    az += 0.1 * t;
    el -= 0.1 * pi * (1. - sin (0.06 * t));
  }
  el = clamp (el, -0.3 * pi, 0.3 * pi);
  zmFac = 4.5 - 1.5 * abs (el);
  dstFar = 50.;
  mobRad = 5.;
  spdVel = 1.5;
  SpdSetup (spdVel * tCur);
  vuMat = StdVuMat (el, az);
  ro = vuMat * vec3 (0., 0., -20.);
  ltDir = vuMat * normalize (vec3 (0.5, 1., -1.));
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
  fragColor = vec4 (pow (col, vec3 (0.9)), 1.);
}

float PrBoxDf (vec3 p, vec3 b)
{
  vec3 d;
  d = abs (p) - b;
  return min (max (d.x, max (d.y, d.z)), 0.) + length (max (d, 0.));
}

float PrSphDf (vec3 p, float r)
{
  return length (p) - r;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float PrEETapCylDf (vec3 p, vec3 v1, vec3 v2, float r, float rf)
{
  vec3 v;
  float s;
  v = v1 - v2;
  s = clamp (dot (p, v) / dot (v, v), 0., 1.);
  return length (p - s * v) - r * (1. - rf * s * s);
}

float PrEllipsDf (vec3 p, vec3 r)
{
  return (length (p / r) - 1.) * min (r.x, min (r.y, r.z));
}

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
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

const float cHashM = 43758.54;

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
  vec3 g;
  vec2 e;
  e = vec2 (0.1, 0.);
  g = vec3 (Fbmn (p + e.xyy, n), Fbmn (p + e.yxy, n), Fbmn (p + e.yyx, n)) - Fbmn (p, n);
  return normalize (n + f * (g - n * dot (n, g)));
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}