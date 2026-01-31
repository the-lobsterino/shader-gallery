/*
 * Original shader from: https://www.shadertoy.com/view/Dl33R2
 */

#ifdef GL_ES
precision highp float;
#endif

// glslsandbox uniforms
uniform float time;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
const vec4 iMouse = vec4(0.);

// --------[ Original ShaderToy begins here ]---------- //
// "Ball Roller" by dr2 - 2023
// License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0

float PrSphDf (vec3 p, float r);
float PrCylDf (vec3 p, float r, float h);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);
vec2 Rot2Cs (vec2 q, vec2 cs);

const int nBall = 3;
vec3 bPos[nBall], qHit = vec3(0.), ltDir = vec3(0.);
vec2 aTurnCs = vec2(0.);
float dstFar = 0., tCur = 0., tRad = 0., bRad = 0.;
int idObj = 0;
const int idTrk = 1, idSup = 2, idBas = 3, idBall = 4;
const float pi = 3.1415927;

#define AA  1   // (= 0/1) optional antialiasing

#if 0
#define VAR_ZERO min (iFrame, 0)
#else
#define VAR_ZERO 0
#endif

#define DMINQ(id) if (d < dMin) { dMin = d;  idObj = id;  qHit = q; }

float ObjDf (vec3 p)
{
  vec3 q;
  float dMin, d, dc, r, rm, rs, a, hMax, ts, tw;
  dMin = dstFar;
  hMax = 3.;
  tw = 0.02;
  ts = bRad + tw + 0.01;
  p.y -= tRad - hMax + 2.;
  q = p;
  r = length (q.xz);
  a = (r > 0.) ? atan (q.z, - q.x) / (2. * pi) : 0.;
  q.xz = Rot2D (q.xz, 2. * pi * (floor (float (2 * nBall) * a) + 0.5) / float (2 * nBall));
  rm = length (q.xy) - tRad;
  rs = 0.2 * tRad - r;
  d = abs (length (vec2 (rm, q.z)) - ts) - tw;
  d = max (max (max (d, - rm), rs), tRad - hMax + q.y);
  DMINQ (idTrk);
  d = max (max (max (length (vec2 (abs (q.x + 0.65 * tRad) - 0.25 * tRad, q.z)) - 0.15,
     0.3 - rm), - q.y - tRad - 0.4), q.y);
  DMINQ (idSup);
  q = p;
  q.xz = Rot2Cs (q.xz, aTurnCs);
  rm = length (q.xy) - tRad;
  dc = length (vec2 (rm, q.z)) - ts;
  d = max (max (max (abs (dc) - tw, - rm), 0.025 - rs), q.y);
  DMINQ (idTrk);
  q.y -= - tRad - 0.25;
  d = max (max (r - 0.15 * tRad, abs (q.y) - 0.18), - dc);
  DMINQ (idSup);
  q.y -= - 0.15;
  d = PrCylDf (q.xzy, tRad + 0.5, 0.05);
  DMINQ (idBas);
  for (int n = 0; n < nBall; n ++) {
    q = p - bPos[n];
    d = PrSphDf (q, bRad);
    DMINQ (idBall + n);
  }
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = VAR_ZERO; j < 120; j ++) {
    d = ObjDf (ro + dHit * rd);
    if (d < 0.0005 || dHit > dstFar) break;
    dHit += d;
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
  d = 0.01;
  for (int j = VAR_ZERO; j < 40; j ++) {
    h = ObjDf (ro + d * rd);
    sh = min (sh, smoothstep (0., 0.03 * d, h));
    d += h;
    if (sh < 0.05) break;
  }
  return 0.7 + 0.3 * sh;
}

float BAng (float s)
{
  return 0.36 * pi * sin (0.5 * tCur + 2. * s);
}

vec4 BCol ()
{
  vec3 q, col;
  float s;
  col = vec3 (0.7, 0.6, 0.1);
  s = pi * float (idObj - idBall) / float (nBall);
  q = qHit;
  q.xz = Rot2D (qHit.xz, s + 0.5 * pi);
  q.xy = Rot2D (q.xy, BAng (s) * tRad / bRad);
  if (abs (q.z) < 0.03) col = vec3 (1., 1., 0.3);
  else col = (q.z * (mod (pi + atan (q.x, q.y), 2. * pi) - pi) > 0.) ? vec3 (0., 1., 1.) :
     vec3 (1., 0., 1.);
  return vec4 (col, 0.2);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, vn;
  float dstObj, sh, nDotL, a, aMin, s, sMin;
  tRad = 5.;
  bRad = 0.25;
  aMin = 99.;
  for (int n = 0; n < nBall; n ++) {
    s = pi * float (n) / float (nBall);
    a = BAng (s);
    if (abs (a) < aMin) {
      aMin = abs (a);
      sMin = s;
    }
    bPos[n] = vec3 (0., - tRad * sin (a + vec2 (0.5 * pi, 0.)));
    bPos[n].xz = Rot2D (bPos[n].xz, - s);
  }
  aTurnCs = sin (sMin + 0.5 * pi + vec2 (0.5 * pi, 0.));
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    nDotL = max (dot (vn, ltDir), 0.);
    if (idObj == idTrk) {
      col4 = vec4 (0.9, 0.9, 1., 0.2) * (0.9 + 0.1 * cos (128. * atan (qHit.x, qHit.y)));
    } else if (idObj == idSup) {
      col4 = vec4 (0.7, 0.5, 0.2, 0.1) * (0.9 + 0.1 * sin (2. * pi * fract (8. * qHit.y)));
    } else if (idObj == idBas) {
      col4 = vec4 (0.5, 0.6, 0.5, 0.1) * (0.97 + 0.03 * sin (32. * float (nBall) *
         atan (qHit.z, qHit.x)));
    } else if (idObj >= idBall) {
      col4 = BCol ();
      nDotL *= nDotL;
    }
    sh = ObjSShadow (ro + 0.01 * vn, ltDir);
    col = col4.rgb * (0.2 + 0.8 * sh * nDotL) +
       col4.a * step (0.95, sh) * pow (max (dot (ltDir, reflect (rd, vn)), 0.), 32.);
  } else {
    col = vec3 (0.1);
  }
  return clamp (col, 0., 1.);
}

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
  el = -0.2 * pi;
  zmFac = 4.;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += pi * mPtr.y;
    zmFac += 2. * abs (az);
  } else {
    az -= 0.03 * pi * tCur;
    el -= 0.1 * pi * sin (0.02 * pi * tCur);
  }
  el = clamp (el, -0.4 * pi, 0.01 * pi);
  vuMat = StdVuMat (el, az);
  ro = vuMat * vec3 (0., 0., -24.);
  dstFar = 100.;
  ltDir = vuMat * normalize (vec3 (-0.5, 1., -1.));
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

float PrSphDf (vec3 p, float r)
{
  return length (p) - r;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
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
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}