/*
 * Original shader from: https://www.shadertoy.com/view/3djfWW
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
// "Big Rubik Pseudosolver" by dr2 - 2020
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

#define SIZE4  1  // =1 for 4^3 cube; =0 for 3^3

#define AA     0  // optional antialiasing

mat3 VToRMat (vec3 v, float a);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);
float Minv3 (vec3 p);
float Maxv3 (vec3 p);
float Hashff (float p);

#define VAR_ZERO 0

mat3 vuMat = mat3(0.);
vec2 qBlk = vec2(0.);
float tCur = 0., dstFar = 0., bSize = 0., rSeed = 0.;
const float pi = 3.1415927;

vec4 BlkHit (vec3 ro, vec3 rd, vec3 p, mat3 m)
{
  vec3 rdm, v, tm, tp, u, fcBlk;
  float dMin, dn, df;
  dMin = dstFar;
  rdm = m * rd;
  v = (m * ro - p) / rdm;
  tp = bSize / abs (rdm) - v;
  tm = - tp - 2. * v;
  dn = Maxv3 (tm);
  df = Minv3 (tp);
  if (df > 0. && dn < min (df, dMin)) {
    dMin = dn;
    fcBlk = - sign (rdm) * step (tm.zxy, tm) * step (tm.yzx, tm);
    u = (v + dn) * rdm;
  }
  if (dMin < dstFar) {
    qBlk = vec2 (dot (u.zxy, fcBlk), dot (u.yzx, fcBlk));
  }
  return vec4 (dMin, fcBlk);
}

vec4 SphHit (vec3 ro, vec3 rd, float rad)
{
  vec3 vn;
  float b, d, w;
  b = dot (rd, ro);
  w = b * b + rad * rad - dot (ro, ro);
  d = dstFar;
  if (w > 0.) {
    d = - b - sqrt (w);
    vn = (ro + d * rd) / rad;
  }
  return vec4 (d, vn);
}

#if SIZE4
const float nbE = 4.;
const float nTwist = 28.;
#else
const float nbE = 3.;
const float nTwist = 22.;
#endif

mat3 RotSeq (vec3 bId, float nt, float aRot)
{                     // Derived rotation matrix sequence from Kali's "Rubik"
  mat3 rMat, m;
  vec3 ax[3], vSlice;
  vec2 e;
  float s, sa;
  e = vec2 (1., 0.);
  ax[0] = e.xyy;
  ax[1] = e.yxy;
  ax[2] = e.yyx;
  rMat = mat3 (e.xyy, e.yxy, e.yyx);
  for (float n = float (VAR_ZERO); n < nTwist; n ++) {
    if (n > nt) break;
    s = mod (n + floor (6. * Hashff (99. + rSeed)), 6.);
    sa = sign (s - 2.5);
    s = mod (s, 3.);
    vSlice = (s == 0.) ? e.xyy : ((s == 1.) ? e.yxy : e.yyx);
    if (length ((bId + 0.5 * (nbE + 1.)) * vSlice) - 1. == floor (nbE * Hashff (n + rSeed))) {
      m = VToRMat (sa * ((s == 0.) ? ax[0] : ((s == 1.) ? ax[1] : ax[2])),
         0.5 * pi * ((n < nt) ? 1. : aRot));
      for (int k = 0; k < 3; k ++) ax[k] = m * ax[k];
      rMat = m * rMat;
      if (n < nt) bId = VToRMat (sa * vSlice, -0.5 * pi) * bId;
    }
  }
  return rMat;
}

float LabSym (vec2 p)
{
  vec2 q;
  float d, r;
  r = length (p);
  d = max (min (0.06 - abs (0.1 - abs (r - 0.8)), p.y), min (0.06 - abs (p.y), 1.1 - abs (p.x)));
  q = Rot2D (p, 2. * pi * floor (16. * ((r > 0.) ? atan (p.y, - p.x) / (2. * pi) : 0.) + 0.5) / 16.);
  d = max (d, min (min (0.06 - abs (q.y), 0.2 - abs (q.x + 1.1)), p.y + 0.1));
  q.x += 1.5;
  d = max (d, min (0.1 - length (q), p.y + 0.1));
  return d;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  mat3 rMat, rMatH;
  vec4 col4, bs4;
  vec3 col, vn, ltDir, fcBlk, bId, bidH, cc[6], de3, ld, bLab;
  vec2 qBlkH, de;
  float dstBlk, dstSphr, d, nt, tCyc, shSpd, tWait, aRot, dSum, sSum, bMin;
  cc[0] = vec3 (1., 0.2, 0.2);
  cc[1] = vec3 (1., 0.4, 0.2);
  cc[2] = vec3 (0.2, 0.2, 1.);
  cc[3] = vec3 (0.2, 1., 0.2);
  cc[4] = vec3 (1., 1., 0.2);
  cc[5] = vec3 (1., 1., 1.);
  bSize = 0.48;
  shSpd = 10.;
  tWait = 3.;
  tCyc = (nTwist + tWait) * (1. + 1. / shSpd) + tWait;
  nt = nTwist - max (0., mod (tCur, tCyc) - tWait);
  if (nt + tWait < 0.) nt = - shSpd * (nt + tWait);
  aRot = smoothstep (0.1, 0.9, max (0., fract (nt) * sign (nt)));
  nt = max (0., floor (nt));
  rSeed = 17.77 * floor ((tCur + (nTwist + tWait) / shSpd + tWait) / tCyc + 1.);
  bMin = 0.5 * (nbE - 1.) - 0.5;
  bLab = vec3 (0., 0., -1.);
  if (nbE == 4.) bLab -= 0.5;
  dstBlk = dstFar;
  for (float j = float (VAR_ZERO); j < nbE * nbE * nbE; j ++) {
    bId = vec3 (mod (j, nbE), mod (floor (j / nbE), nbE), floor (j / (nbE * nbE))) - 0.5 * (nbE - 1.);
    if (Maxv3 (abs (bId)) > bMin) {
      rMat = RotSeq (bId, nt, aRot);
      bs4 = BlkHit (ro, rd, bId, rMat);
      d = bs4.x;
      if (d < dstBlk) {
        dstBlk = d;
        fcBlk = bs4.yzw;
        rMatH = rMat;
        qBlkH = qBlk;
        bidH = bId;
      }
    }
  }
  bs4 = SphHit (ro, rd, (nbE - 0.2) * bSize);
  dstSphr = bs4.x;
  if (min (dstBlk, dstSphr) < dstFar) {
    if (dstBlk < dstSphr) {
      ro += dstBlk * rd;
      de = smoothstep (-0.08, 0., abs (qBlkH.xy) - bSize);
      de3 = vec3 (0.25 * pi * de * sign (qBlkH.xy), 0.);
      vn = normalize (fcBlk + ((fcBlk.x != 0.) ? de3.zxy : ((fcBlk.y != 0.) ? de3.xzy : de3))) * rMatH;
      if (length (max (abs (qBlkH) - bSize + 0.12, 0.)) < 0.07) {
        if (abs (bidH.x) > bMin && sign (bidH.x) == fcBlk.x ||
            abs (bidH.y) > bMin && sign (bidH.y) == fcBlk.y ||
            abs (bidH.z) > bMin && sign (bidH.z) == fcBlk.z) {
          if      (abs (fcBlk.x) == 1.) col4.rgb = (fcBlk.x > 0.) ? cc[0] : cc[1];
          else if (abs (fcBlk.y) == 1.) col4.rgb = (fcBlk.y > 0.) ? cc[2] : cc[3];
          else if (abs (fcBlk.z) == 1.) col4.rgb = (fcBlk.z > 0.) ? cc[4] : cc[5];
          col4 = vec4 (mix (col4.rgb, vec3 (0.2, 0.2, 0.2), max (de.x, de.y)), 0.2);
        } else {
          col4 = vec4 (0.1, 0.1, 0.1, 0.);
        }
        if (bidH == bLab && sign (bidH.z) == fcBlk.z)
           col4 *= 1. - 0.6 * smoothstep (-0.05, 0., LabSym (-16. * (vec2 (0.5, 0.5) * bSize + qBlkH.yx)));
      } else {
        col4 = vec4 (0.2, 0.2, 0.2, 0.2);
      }
    } else if (dstSphr < dstFar) {
      ro += dstSphr * rd;
      vn = bs4.yzw;
      col4 = vec4 (0.1, 0.1, 0.1, 0.);
    }
    dSum = 0.;
    sSum = 0.;
    ltDir = normalize (vec3 (1., 1., -0.6));
    for (int j = 0; j < 4; j ++) {
      ltDir.xy = Rot2D (ltDir.xy, 0.5 * pi);
      ld = vuMat * ltDir;
      dSum += pow (max (dot (vn, ld), 0.), 1.5);
      sSum += pow (max (dot (normalize (ld - rd), vn), 0.), 32.);
    }
    col = col4.rgb * (0.2 + 0.5 * dSum) + col4.a * sSum;
    col = pow (clamp (col, 0., 1.), vec3 (0.8));
  } else {
    col = vec3 (0.6);
  }
  return col;
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
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
  el = -0.15 * pi;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += pi * mPtr.y;
  } else {
    az -= 0.04 * pi * tCur;
    el -= 0.07 * pi * (1. + sin (0.05 * pi * tCur));
  }
  vuMat = StdVuMat (el, az);
  ro = vuMat * vec3 (0., 0., -10. * nbE / 3.);
  zmFac = 3.7;
  dstFar = 100.;
  if (length (uv) < 0.99) {
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
  } else col = mix (vec3 (0.6), vec3 (0.82), smoothstep (0., 0.1, length (uv) - 0.99));
  fragColor = vec4 (col, 1.);
}

mat3 VToRMat (vec3 v, float a)
{
  mat3 m;
  vec3 w, b1, b2;
  vec2 cs;
  cs = sin (a + vec2 (0.5 * pi, 0.));
  w = (1. - cs.x) * v * v + cs.x;
  b1 = (1. - cs.x) * v.zyx * v.xzy;
  b2 = - cs.y * v;
  m[0][0] = w.x;  m[1][1] = w.y;  m[2][2] = w.z;
  m[1][2] = b1.x + b2.x;  m[2][1] = b1.x - b2.x;
  m[2][0] = b1.y + b2.y;  m[0][2] = b1.y - b2.y;
  m[0][1] = b1.z + b2.z;  m[1][0] = b1.z - b2.z;
  return m;
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

float Minv3 (vec3 p)
{
  return min (p.x, min (p.y, p.z));
}

float Maxv3 (vec3 p)
{
  return max (p.x, max (p.y, p.z));
}

const float cHashM = 43758.54;

float Hashff (float p)
{
  return fract (sin (p) * cHashM);
}
// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    iMouse = vec4(mouse * resolution, 1., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}