/*
 * Original shader from: https://www.shadertoy.com/view/XlXyzj
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
// "Burping Volcano" by dr2 - 2017
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

float PrSphDf (vec3 p, float s);
float PrCylDf (vec3 p, float r, float h);
float PrTorusDf (vec3 p, float ri, float rc);
float Hashff (float p);
float Noiseff (float p);
float Noisefv2 (vec2 p);
float Noisefv3 (vec3 p);
float Fbm2 (vec2 p);
float Fbm3 (vec3 p);
vec3 VaryNf (vec3 p, vec3 n, float f);
vec2 Rot2D (vec2 q, float a);
float SmoothMin (float a, float b, float r);
float SmoothBump (float lo, float hi, float w, float x);

#define NROCK 16
vec4 rkPos[NROCK];
vec3 sunDir = vec3(0.), flmCylPos = vec3(0.), smkPos = vec3(0.);
float dstFar = 0., tCur = 0., lavHt = 0., qRad = 0., flmCylRad = 0., flmCylLen = 0., smkRadEx = 0.,
   smkRadIn = 0., smkPhs = 0., szFac = 0., densFac = 0.;
int idObj = 0;
const int idMnt = 1, idRock = 2, idLav = 3;
const float pi = 3.14159;

float MountDf (vec3 p, float dMin)
{
  vec3 q;
  float d, a, r, hd, s;
  q = p;
  a = atan (q.z, q.x) / (2. * pi) + 0.5;
  r = length (q.xz);
  s = 2. * Fbm2 (vec2 (33. * a, 7. * r)) - 0.5;
  d = PrCylDf (q.xzy, 2., 0.75);
  q.y -= 0.75;
  d = max (d, - (PrSphDf (q, 0.35) - 0.03 * s));
  hd = 0.015 * (1. + sin (64. * pi * a) + 2. * sin (25. * pi * a)) *
     SmoothBump (0.5, 1.8, 0.3, r) + 0.15 * s * SmoothBump (0.1, 2., 0.2, r);
  q.y -= 1.2 + hd;
  d = max (max (d, - PrTorusDf (q.xzy, 2.8, 2.8)), 0.15 - length (q.xz));
  q = p;
  q.y -= -0.75;
  d = max (SmoothMin (d, PrCylDf (q.xzy, 2.5, 0.05 *
     (1. - smoothstep (2.2, 2.5, length (q.xz)))), 0.2), - q.y);
  if (d < dMin) { dMin = d;  idObj = idMnt; }
  q = p;
  q.y -= lavHt;
  d = PrCylDf (q.xzy, 0.3, 0.02);
  if (d < dMin) { dMin = d;  idObj = idLav; }
  return 0.8 * dMin;
}

float ObjDf (vec3 p)
{
  float dMin, d;
  dMin = dstFar;
  dMin = MountDf (p, dMin);
  for (int j = 0; j < NROCK; j ++) {
    d = PrSphDf (p - rkPos[j].xyz, rkPos[j].w);
    if (d < dMin) { dMin = d;  idObj = idRock;  qRad = rkPos[j].w; }
  }
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 100; j ++) {
    d = ObjDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.001 || dHit > dstFar) break;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  vec3 e = vec3 (0.001, -0.001, 0.);
  v = vec4 (ObjDf (p + e.xxx), ObjDf (p + e.xyy),
     ObjDf (p + e.yxy), ObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

float TransObjRay (vec3 ro, vec3 rd)
{
  vec3 q;
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 100; j ++) {
    q = ro + dHit * rd - flmCylPos;
    d = PrCylDf (q.xzy, flmCylRad, flmCylLen);
    dHit += d;
    if (d < 0.001 || dHit > dstFar) break;
  }
  return dHit;
}

void SetRocks ()
{
  vec3 bv0, bp0, bp;
  float a, tm, fj;
  for (int j = 0; j < NROCK; j ++) {
    fj = float (j);
    a = 2. * pi * Hashff (100.11 * fj);
    bv0.xz = 0.7 * vec2 (cos (a), sin (a));
    bv0.y = 1.4 + 0.3 * Hashff (11.11 * fj);
    bp0.xz = 0.1 * bv0.xz;  
    bp0.y = 0.5;
    tm = mod (tCur + 0.15 * (fj + 0.6 * Hashff (fj)), 4.);
    bp = bp0 + bv0 * tm;  
    bp.y -= 0.5 * tm * tm;
    rkPos[j] = vec4 (bp, 0.04 - 0.03 * tm / 4.);
  }
}

float FlmAmp (vec3 ro, vec3 rd, float dHit)
{
  vec3 p, q, dp;
  float g, s, fh, fr, f, hs;
  p = ro + dHit * rd - flmCylPos;
  hs = min (p.y / flmCylLen, 1.);
  dp = (flmCylRad / 20.) * rd;
  g = 0.;
  for (int i = 0; i < 20; i ++) {
    p += dp;
    s = distance (p.xz, flmCylPos.xz);
    q = 4. * p;  q.y -= 6. * tCur;
    fh = 0.5 * max (1. - (p.y - flmCylPos.y) / flmCylLen, 0.);
    fr = max (1. - s / flmCylRad, 0.);
    f = Fbm3 (q);
    q = 7. * p;  q.y -= 8.5 * tCur;
    f += Fbm3 (q);
    g += max (0.5 * fr * fr * fh * (f * f - 0.6), 0.);
    q = 23. * p;  q.y -= 11. * tCur;
    g += 1000. * pow (abs (Noisefv3 (q) - 0.11), 64.);
    if (s > flmCylRad || p.y < flmCylPos.y - 0.99 * flmCylLen || g > 1.) break;
  }
  g = clamp (0.9 * g, 0., 1.);
  if (hs > 0.) g *= 1. - hs * hs;
  return g;
}

vec3 BgCol (vec3 ro, vec3 rd)
{
  vec3 col, vn;
  float f;
  if (rd.y >= 0.) {
    ro.xz += 0.5 * tCur;
    f = Fbm2 (0.02 * (rd.xz * (100. - ro.y) / max (rd.y, 0.001) + ro.xz));
    col = vec3 (0.1, 0.2, 0.4);
    col = mix (col, vec3 (0.8), clamp (3. * (f - 0.5) * rd.y + 0.1, 0., 1.));
  } else {
    ro -= ((ro.y + 0.75) / rd.y) * rd;
    col = vec3 (0.17, 0.14, 0.05) * (0.7 + 0.3 * Fbm2 (10. * ro.xz));
    f = 1. - smoothstep (0.1, 1., length (ro.xz) / dstFar);
    vn = VaryNf (10. * ro, vec3 (0., 1., 0.), 3. * f);
    col = col * (0.1 + 0.1 * max (vn.y, 0.) + 0.8 * max (dot (vn, sunDir), 0.));
  }
  return col;
}

float SmokeDens (vec3 p)
{
  mat2 rMat;
  vec3 q, u;
  p = p.xzy;
  q = p / smkRadEx;
  u = normalize (vec3 (q.xy, 0.));
  q -= u;
  rMat = mat2 (vec2 (u.x, - u.y), u.yx);
  q.xy = rMat * q.xy;
  q.xz = Rot2D (q.xz, 2. * tCur);
  q.xy = q.xy * rMat;
  q += u;
  q.xy = Rot2D (q.xy, 0.1 * tCur);
  return clamp (smoothstep (0., 1., densFac * PrTorusDf (p, smkRadIn, smkRadEx)) *
     Fbm3 (5. * q + 0.01 * tCur) - 0.1, 0., 1.);
}

float SmokeShellDist (vec3 ro, vec3 rd)
{
  vec3 q;
  float d, h;
  d = 0.;
  for (int j = 0; j < 150; j ++) {
    q = ro + d * rd;
    h = PrTorusDf (q.xzy, smkRadIn, smkRadEx);
    d += h;
    if (h < 0.001 || d > dstFar) break;
  }
  return d;
}

vec4 SmokeCol (vec3 ro, vec3 rd, vec3 col)
{
  vec3 clCol, tCol, q;
  float d, dens, atten, sh;
  clCol = vec3 (0.9);
  atten = 0.;
  d = 0.;
  for (int j = 0; j < 150; j ++) {
    q = ro + d * rd;
    dens = SmokeDens (q);
    sh = 0.5 + 0.5 * smoothstep (-0.2, 0.2, dens - SmokeDens (q + 0.1 * szFac * sunDir));
    tCol = mix (vec3 (1., 0.2, 0.), vec3 (0.6, 0.6, 0.), clamp (smoothstep (0.2, 0.8, dens) +
       0.2 * (1. - 2. * Noiseff (10. * tCur)), 0., 1.));
    tCol = mix (mix (tCol, clCol, smkPhs), clCol, smoothstep (-0.15, -0.05,
       (length (vec3 (q.xz * (1. - smkRadEx / length (q.xz)), q.y)) - smkRadIn) / szFac));
    col = mix (col, 4. * dens * tCol * sh, 0.2 * (1. - atten) * dens);
    atten += 0.12 * dens;
    d += szFac * 0.01;
    if (atten > 1. || d > dstFar) break;
  }
  atten *= smoothstep (0.02, 0.04, smkPhs);
  return vec4 (col, atten);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, vn, roo;
  float dstHit, dstFlm, dstFlmR, intFlm, bgFlm, s, dstSmk;
  lavHt = 0.4 + 0.12 * cos (2. * pi * smkPhs);
  flmCylPos = vec3 (0., 0.9, 0.);
  flmCylRad = 0.35;
  flmCylLen = 1.3;
  roo = ro;
  SetRocks ();
  dstFlm = TransObjRay (ro, rd);
  dstHit = ObjRay (ro, rd);
  bgFlm = (0.7 + 0.6 * Noiseff (10. * tCur));
  intFlm = (dstFlm < dstHit) ? FlmAmp (ro, rd, dstFlm) : 0.;
  if (dstHit >= dstFar) col = BgCol (ro, rd);
  else {
    ro += dstHit * rd;
    vn = ObjNf (ro);
    if (idObj == idMnt) {
      s = clamp (ro.y / 1.2 + 0.6, 0., 1.);
      vn = VaryNf (10. * ro, vn, 5. - 2. * s);
      col = (0.5 + 0.7 * bgFlm * s) * vec3 (0.2 + 0.1 * (1. - s),
         0.05 + 0.2 * (1. - s), 0.05);
      col = col * (0.1 + 0.1 * max (vn.y, 0.) +
         0.8 * max (dot (vn, sunDir), 0.));
    } else if (idObj == idLav) {
      col = mix (vec3 (0.4, 0., 0.), vec3 (0.8, 0.7, 0.),
         step (1.1, 2. * Fbm2 (41. * ro.xz * vec2 (1. + 0.2 * sin (1.7 * tCur) *
         vec2 (1. + 0.13 * sin (4.31 * tCur), 1. + 0.13 * cos (4.61 * tCur))))));
      vn = VaryNf (21. * ro, vn, 10.);
      col *= 0.5  + 1.5 * pow (max (vn.y, 0.), 32.);
    } else if (idObj == idRock) {
      col = mix (vec3 (0.8, 0., 0.), vec3 (0.1, 0.3, 0.1),
         1. - (qRad - 0.005) / 0.03);
      vn = VaryNf (200. * ro, vn, 10.);
      col = col * (0.6 + 0.4 * max (dot (vn, vec3 (0., 0.5, 0.)), 0.));
    }
  }
  if (intFlm > 0.) col = mix (col, bgFlm * mix (vec3 (1., 0.1, 0.1),
     vec3 (1., 1., 0.5), 0.5 * intFlm), 1.2 * intFlm);
  ro = roo - smkPos;
  dstSmk = SmokeShellDist (ro, rd);
  col4 = (dstSmk < min (dstHit, dstFar)) ? SmokeCol (ro + dstSmk * rd, rd, col) : vec4 (col, 0.);
  col = mix (col, col4.rgb, min (col4.a, 1.));
  return pow (clamp (col, 0., 1.), vec3 (0.7));
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  vec4 mPtr;
  vec3 rd, ro;
  vec2 canvas, uv;
  float az, el;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  dstFar = 30.;
  szFac = 1.;
  smkPhs = mod (0.04 * tCur, 1.);
  smkRadIn = 0.25 * szFac;
  smkRadEx = (0.5 - 0.4 * pow (1. - smkPhs, 2.)) * szFac;
  densFac = 7.2 * (pow (smkPhs, 1.5) - 1.08) / szFac;
  smkPos = vec3 (0., 0.6 + 4. * smkPhs * (1. - smoothstep (0.9, 1., smkPhs)), 0.);
  ro = vec3 (0., 1. * smkPhs * (1. - smoothstep (0.9, 1., smkPhs)), -8.);
  rd = normalize (vec3 (uv, 3.5));
  rd.yz = Rot2D (rd.yz, -0.5 * atan (smkPos.y - ro.y, smkPos.z - ro.z));
  az = 0.01 * tCur;
  el = 0.;
  if (mPtr.z > 0.) {
    az -= 2. * pi * mPtr.x;
    el -= 2. * pi * mPtr.y;
  }
  el = clamp (el, -0.01 * pi, 0.25 * pi);
  ro.yz = Rot2D (ro.yz, el);
  rd.yz = Rot2D (rd.yz, el);
  ro.xz = Rot2D (ro.xz, az);
  rd.xz = Rot2D (rd.xz, az);
  sunDir = normalize (vec3 (1., 2., -1.));
  fragColor = vec4 (ShowScene (ro, rd), 1.);
}

float PrSphDf (vec3 p, float s)
{
  return length (p) - s;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float PrTorusDf (vec3 p, float ri, float rc)
{
  return length (vec2 (length (p.xy) - rc, p.z)) - ri;
}

const float cHashM = 43758.54;

float Hashff (float p)
{
  return fract (sin (p) * cHashM);
}

vec2 Hashv2f (float p)
{
  return fract (sin (p + vec2 (0., 1.)) * cHashM);
}

vec2 Hashv2v2 (vec2 p)
{
  vec2 cHashVA2 = vec2 (37., 39.);
  vec2 e = vec2 (1., 0.);
  return fract (sin (vec2 (dot (p + e.yy, cHashVA2), dot (p + e.xy, cHashVA2))) * cHashM);
}

vec4 Hashv4v3 (vec3 p)
{
  vec3 cHashVA3 = vec3 (37., 39., 41.);
  vec2 e = vec2 (1., 0.);
  return fract (sin (vec4 (dot (p + e.yyy, cHashVA3), dot (p + e.xyy, cHashVA3),
     dot (p + e.yxy, cHashVA3), dot (p + e.xxy, cHashVA3))) * cHashM);
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

float Noisefv3 (vec3 p)
{
  vec4 t;
  vec3 ip, fp;
  ip = floor (p);
  fp = fract (p);
  fp *= fp * (3. - 2. * fp);
  t = mix (Hashv4v3 (ip), Hashv4v3 (ip + vec3 (0., 0., 1.)), fp.z);
  return mix (mix (t.x, t.y, fp.x), mix (t.z, t.w, fp.x), fp.y);
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

float Fbm3 (vec3 p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int i = 0; i < 5; i ++) {
    f += a * Noisefv3 (p);
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
  for (int i = 0; i < 5; i ++) {
    s += a * vec3 (Noisefv2 (p.yz), Noisefv2 (p.zx), Noisefv2 (p.xy));
    a *= 0.5;  
    p *= 2.;
  }
  return dot (s, abs (n));
}

vec3 VaryNf (vec3 p, vec3 n, float f)
{
  vec3 e = vec3 (0.1, 0., 0.);
  vec3 g;
  float s;
  s = Fbmn (p, n);
  g = vec3 (Fbmn (p + e.xyy, n) - s, Fbmn (p + e.yxy, n) - s, Fbmn (p + e.yyx, n) - s);
  return normalize (n + f * (g - n * dot (n, g)));
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

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}