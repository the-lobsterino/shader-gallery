/*
 * Original shader from: https://www.shadertoy.com/view/ltdyW4
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
// "[SH18] Post-Human Production" by dr2 - 2018
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

#define AA   0

float PrBoxDf (vec3 p, vec3 b);
float PrRoundBoxDf (vec3 p, vec3 b, float r);
float PrBox2Df (vec2 p, vec2 b);
float PrSphDf (vec3 p, float s);
float PrRoundCylDf (vec3 p, float r, float rt, float h);
vec3 HexGrid (vec2 p);
float SmoothBump (float lo, float hi, float w, float x);
vec2 Rot2D (vec2 q, float a);
vec3 HsvToRgb (vec3 c);
float Hashff (float p);
float Noisefv2 (vec2 p);
vec3 VaryNf (vec3 p, vec3 n, float f);

vec3 ltDir = vec3(0.), vnCylOut = vec3(0.);
float dstFar = 0., tCur = 0., bCylRad = 0., bCylHt = 0., dCylOut = 0., tPhs = 0.,
   rAngH = 0., rAngL = 0., rAngA = 0., wDisp = 0., gGap = 0., zColr = 0.,
   zHead = 0., zBod = 0., zBgn = 0., zEnd = 0.;
int idObj = 0, wkState = 0;
bool onHead = false, onBod = false;
const float pi = 3.14159, sqrt3 = 1.73205;

#define DMIN(id) if (d < dMin) { dMin = d;  idObj = id; }

float RobDf (vec3 p, float dMin)
{
  vec3 q;
  float d, ah;
  d = dstFar;
  p.y -= 0.25;
  if (onHead) {
    q = p;  q.y -= 2.3;
    d = min (d, max (PrSphDf (q, 0.85), - q.y - 0.2));
  }
  if (onBod) {
    q = p;  q.y -= 1.5;
    d = min (d, PrRoundCylDf (q.xzy, 0.9, 0.28, 0.75));
    q = p;  q.x = abs (q.x) - 1.05;  q.y -= 2.;
    q.yz = Rot2D (q.yz, rAngA * ((wkState == 1) ? sign (p.x) : 1.));
    q.y -= -0.5;
    d = min (d, PrRoundCylDf (q.xzy, 0.2, 0.15, 0.6));
  }
  if (onHead) {
    q = p;
    ah = rAngH * ((wkState == 1) ? 1. : 0.);
    q.xz = Rot2D (q.xz, ah);
    q.x = abs (q.x) - 0.3;  q.y -= 3.1;
    q.xy = Rot2D (q.xy, 0.2 * pi);
    q.y -= 0.25;
    d = min (d, PrRoundCylDf (q.xzy, 0.06, 0.04, 0.3));
  }
  q = p;  q.x = q.x - 0.4;  q.y -= 0.95;
  q.yz = Rot2D (q.yz, - rAngL);
  q.y -= -0.65;
  d = min (d, PrRoundCylDf (q.xzy, 0.25, 0.15, 0.65));
  q = p;
  q.x = - q.x - 0.4;  q.y -= 0.95;
  q.yz = Rot2D (q.yz, rAngL);
  q.y -= -0.65;
  d = min (d, PrRoundCylDf (q.xzy, 0.25, 0.15, 0.65));
  DMIN (1);
  if (onHead) {
    q = p;
    q.xz = Rot2D (q.xz, ah);
    q.x = abs (q.x) - 0.4;  q.yz -= vec2 (2.7, 0.7);  d = PrSphDf (q, 0.15);
    DMIN (2);
  }
  return dMin;
}

void SetAng (int wkState)
{
  float tc;
  tc = 2. * pi * mod (0.5 * tPhs, 1.);
  if (wkState == 1) {
    rAngH = -0.7 * sin (tc);
    rAngA = 1.1 * sin (tc);
    rAngL = 0.5 * sin (tc);
  } else if (wkState == 0) {
    rAngH = 0.4 * sin (tc);
    rAngA = pi - abs (tc - pi); 
    rAngL = 0.;
  } else if (wkState == -1) {
    rAngH = 0.;
    rAngA = 0.; 
    rAngL = 0.;
  }
}

float ObjDf (vec3 p)
{
  vec3 q;
  float dMin, d;
  dMin = dstFar;
  p.x = abs (p.x) - 6.;
  q = p;
  q.x = abs (q.x) - 2.;
  q.z = mod (q.z - wDisp + 0.5 * gGap, gGap) - 0.5 * gGap;
  SetAng ((p.z > zColr) ? wkState : -1);
  onHead = (p.z > zHead);
  onBod = (p.z > zBod);
  dMin = max (RobDf (q, dMin), max (p.z - zEnd, zBgn - p.z));
  q = p;  q.yz -= vec2 (2.4, zColr);
  d = PrRoundBoxDf (q, vec3 (4., 2.4, 0.25), 0.05);
  d = min (max (d, - PrBox2Df (q.xy - vec2 (0., -0.2), vec2 (3.6, 2.4))), PrBoxDf (q, vec3 (3.6, 2.4, 0.15)));
  DMIN (3);
  q = p;
  q.z = abs (q.z - 0.5 * (zBgn + zEnd)) - 0.5 * abs (zBgn - zEnd);
  q.y -= 2.4;
  d = PrRoundBoxDf (q, vec3 (4., 2.4, 1.), 0.05);
  DMIN (4);
  q = p;
  q.z = abs (q.z - 0.5 * (zHead + zBod)) - 0.5 * abs (zHead - zBod);
  q.y -= 2.4;
  d = PrRoundBoxDf (q, vec3 (4., 2.4, 1.1), 0.05);
  q.x = abs (q.x) - 2.;
  d = min (max (d, - PrBox2Df (q.xy - vec2 (0., -0.2), vec2 (1.3, 2.4))), PrBoxDf (q, vec3 (1.3, 2.4, 1.)));
  DMIN (4);
  q.y -= 2.6;
  d = PrRoundCylDf (q.xzy, 0.2, 0.05, 0.15);
  DMIN (5);
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 120; j ++) {
    d = ObjDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.0005 || dHit > dstFar) break;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  const vec3 e = vec3 (0.0001, -0.0001, 0.);
  vec4 v = vec4 (ObjDf (p + e.xxx), ObjDf (p + e.xyy),
     ObjDf (p + e.yxy), ObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

float ObjSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 0.1;
  for (int j = 0; j < 20; j ++) {
    h = ObjDf (ro + rd * d);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += h;
    if (sh < 0.05) break;
  }
  return 0.7 + 0.3 * sh;
}

void InCylHit (vec3 ro, vec3 rd)
{
  vec3 s;
  float a, b, w, ws, srdy;
  dCylOut = dstFar;
  vnCylOut = vec3 (0.);
  a = dot (rd.xz, rd.xz);
  b = dot (rd.xz, ro.xz);
  w = b * b - a * (dot (ro.xz, ro.xz) - bCylRad * bCylRad);
  if (w > 0.) {
    ws = sqrt (w);
    srdy = sign (rd.y);
    if (a > 0.) {
      dCylOut = (- b + ws) / a;
      s = ro + dCylOut * rd;
    } else s.y = bCylHt;
    if (abs (s.y) < bCylHt) vnCylOut.xz = - s.xz / bCylRad;
    else {
      dCylOut = (- srdy * ro.y + bCylHt) / abs (rd.y);
      vnCylOut.y = - srdy;
    }
  }
}

vec3 ShStagGrid (vec2 p)
{
  vec2 q, sq, ss;
  q = p;
  if (2. * floor (0.5 * floor (q.y)) != floor (q.y)) q.x += 0.5;
  sq = smoothstep (0.05, 0.1, abs (fract (q + 0.5) - 0.5));
  q = fract (q) - 0.5;
  ss = 0.25 * smoothstep (0.3, 0.5, abs (q.xy)) * sign (q.xy);
  if (abs (q.x) < abs (q.y)) ss.x = 0.;
  else ss.y = 0.;
  return vec3 (ss.x, 0.8 + 0.2 * sq.x * sq.y, ss.y);
}

vec3 BgCol (vec3 ro, vec3 rd)
{
  vec3 vn, col, qh, rg;
  vec2 qw;
  float hy, hhy, hw, ww, f, b, aa, sRotH, sRotV, sh;
  float ga = 2.39996; // = pi * (3 - sqrt(5))
  InCylHit (ro + vec3 (0., - bCylHt, 0.), rd);
  if (vnCylOut.y == 0.) {
    ro += dCylOut * rd;
    vn = vnCylOut;
    hy = ro.y / bCylHt - 1.;
    hhy = abs (hy) - 0.4;
    aa = atan (vn.x, - vn.z) / pi;
    sRotH = mod (64. * 0.5 * (1. + aa) + 0.5, 1.) - 0.5;
    hw = 0.29;
    ww = 0.28;
    qw = abs (vec2 (sRotH, hhy));
    if (qw.x < ww && qw.y < hw) {
      qw = abs (qw - 0.5 * vec2 (ww, hw)) - vec2 (0.44 * ww, 0.47 * hw);
      if (max (qw.x, qw.y) < 0.) col = vec3 (0.6, 0.4, 0.2) * (0.8 + 0.2 * cos (0.1 * 2. * pi * tCur));
      else col = vec3 (0.4, 0.5, 0.3) * (0.5 + 0.5 * max (dot (vn, ltDir), 0.)) +
         0.5 * pow (max (dot (normalize (ltDir - rd), vn), 0.), 128.);
    } else {
      col = vec3 (0.6, 0.8, 0.7);
      qw -= vec2 (ww, hw);
      if (abs (hy) > (1. - 0.85/16.) || max (qw.x, qw.y) < 0.02) {
        col *= 0.9;
        vn.xz = Rot2D (vn.xz, - pi * aa);
        if (abs (hy) > (1. - 0.85/16.)) {
          sRotV = (1. - abs (2. * SmoothBump (1. - 0.9/16., 0.97, 0.03, abs (hy)) - 1.));
        } else {
          sRotV = (1. - abs (2. * SmoothBump (hw, hw + 0.02, 0.02, abs (hhy)) - 1.)) * sign (hhy);
          vn.xz = Rot2D (vn.xz, 0.4 * pi * sign (sRotH) *
             (1. - abs (2. * SmoothBump (- (ww + 0.02), ww + 0.02, 0.04, sRotH) - 1.)));
        }
        vn.yz = Rot2D (vn.yz, -0.2 * pi * sRotV * sign (hy));
        vn.xz = Rot2D (vn.xz, pi * aa);
      } else {
        rg = ShStagGrid (16. * vec2 (12. * aa, hy));
        col *= rg.y;
        rg.xz *= sign ((abs (vn.x) > 0.5) ? vn.x : vn.z);
        if (abs (vn.x) > 0.5) {
          if (rg.x == 0.) vn.xy = Rot2D (vn.xy, rg.z);
          else vn.xz = Rot2D (vn.xz, rg.x);
        } else {
          if (rg.x == 0.) vn.zy = Rot2D (vn.zy, rg.z);
          else vn.zx = Rot2D (vn.zx, rg.x);
        }
      }
      col = col * (0.4 + 0.6 * max (dot (vn, ltDir), 0.)) +
         0.1 * pow (max (dot (normalize (ltDir - rd), vn), 0.), 64.);
    }
  } else if (vnCylOut.y > 0.) {
    ro += dCylOut * rd;
    b = 1. - smoothstep (-0.1, -0.01, rd.y) * smoothstep (0.4, 0.8, dCylOut / (1.6 * bCylRad));
    if (abs (abs (ro.x) - 6.) > 4.) {
      qh = HexGrid (ro.zx);
      f = max (length (qh.xy) - 0.5, 0.) * b;
      vn = vec3 (0., Rot2D (vec2 (1., 0.), 4. * f * f));
      vn.zx = vn.z * vec2 (qh.x, - qh.y) / length (qh.xy);
      vn = VaryNf (64. * ro, vn, 0.2 * b);
      col = vec3 (0.72, 0.75, 0.72) * (1. - 0.1 * b * Noisefv2 (128. * ro.xz)) *
         (1. - min (0.2 * b * (1. - smoothstep (0.03, 0.06, qh.z)), 0.1));
    } else {
      vn = vec3 (0., 1., 0.);
      col = vec3 (0.4, 0.4, 0.45) * (1. - 0.3 * SmoothBump (0.4, 0.6, 0.05, mod (abs (ro.x), 1.)));
    }
    sh = ObjSShadow (ro, ltDir);
    col = col * (0.2 + 0.8 * sh * max (dot (vn, ltDir), 0.)) +
       0.1 * sh * pow (max (dot (normalize (ltDir - rd), vn), 0.), 64.);
  } else {
    ro += dCylOut * rd;
    f = 0.;
    qw = ro.xz / bCylRad;
    for (float n = 0.; n < 256.; n ++) f += 1. - smoothstep (0.02, 0.025,
       length (qw - sqrt (n / 256.) * sin (n * ga + vec2 (0.5 * pi, 0.))));
    col = mix (vec3 (0., 0., 0.2), vec3 (1., 1., 0.5), f);
  }
  return col;
}

void SetState ()
{
  float tWalk, tCyc, wkSpd, nCyc;
  gGap = 6.;
  tWalk = 6.;
  tCyc = tWalk + 4.;
  wkSpd = gGap / tWalk;
  nCyc = floor (tCur / tCyc);
  tPhs = tCur - tCyc * nCyc;
  wDisp = nCyc * tWalk * wkSpd;
  if (tPhs < tWalk) {
    wkState = 1;
    wDisp += tPhs * wkSpd;
  } else {
    wkState = 0;
    wDisp += tWalk * wkSpd;
  }
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 vn, col;
  float dstObj, cId;
  SetState ();
  zColr = -6.;
  zHead = -24.;
  zBod = -36.;
  zBgn = - bCylRad;
  zEnd = bCylRad;
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += rd * dstObj;
    cId = Hashff (11. * sign (ro.x) + 17. * floor ((ro.z - wDisp) / gGap + 0.5));
    vn = ObjNf (ro);
    if (idObj == 1) col4 = (ro.z > zColr) ? vec4 (HsvToRgb (vec3 (cId, 1., 0.8)), 0.2) :
       vec4 (0.9, 0.8, 0.8, 0.);
    else if (idObj == 2) col4 = (ro.z > zColr) ? vec4 (0.1, 0.5, 0.2, 0.5) : vec4 (0.3, 0.3, 0.3, 0.);
    else if (idObj == 3) {
      col4 = vec4 (0.3, 0.4, 0.3, 0.1);
      if (abs (abs (ro.x) - 6.) < 3.59 && ro.y < 4.39) col4 = vec4 (HsvToRgb (vec3 (cId, 1., 1.)), -1.);
    } else if (idObj == 4) {
      col4 = vec4 (0.3, 0.4, 0.3, 0.1);
      if (abs (abs (abs (ro.x) - 6.) - 2.) < 1.29 && ro.y < 4.59) {
        if (length (ro.xz) < 0.8 * bCylRad && abs (tPhs - 7.5) < 1.)
           col4.rgb = vec3 (1., 1., 0.7) * (0.5 + 0.5 * cos (8. * 2. * pi * tCur));
        else col4.rgb = vec3 (0.1, 0.2, 0.1);
      }
    } else if (idObj == 5) {
      col4 = (abs (tPhs - 7.5) < 1.5 ) ? vec4 (1., 0., 0., -1.) : vec4 (0., 1., 0., -1.);
      col4.rgb *= 0.3 + 0.7 * smoothstep (0., 0.2, dot (vn, - rd));
    }
    col = (col4.a >= 0.) ? col4.rgb * (0.2 + 0.8 * max (dot (vn, ltDir), 0.)) +
       col4.a * pow (max (dot (normalize (ltDir - rd), vn), 0.), 64.) : 0.8 * col4.rgb;
    if (idObj == 1 && ro.z > zColr) {
      rd = reflect (rd, vn);
      if (rd.y > 0.) col += 0.2 * BgCol (ro, rd);
    }
  } else col = BgCol (ro, rd);
  return col;
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, col;
  vec2 canvas, uv, ori, ca, sa;
  float el, az, zmFac;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  bCylRad = 48.;
  bCylHt = 12.;
  az = 0.67 * pi + (1.2/16.) * pi * (floor (0.2 * tCur) +
     smoothstep (0.9, 1., mod (0.2 * tCur, 1.)));
  el = -0.03 * pi;
  if (mPtr.z > 0.) {
    az += 3. * pi * mPtr.x;
    el += 0.7 * pi * mPtr.y;
  }
  el = clamp (el, -0.4 * pi, -0.02 * pi);
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  vuMat = mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
          mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
  ro = vuMat * vec3 (0., 2., -0.95 * bCylRad);
  zmFac = 2.7;
  dstFar = 2. * bCylRad;
  ltDir = vuMat * normalize (vec3 (1., 2., -1.));
#if ! AA
  const float naa = 1.;
#else
  const float naa = 4.;
#endif  
  col = vec3 (0.);
  for (float a = 0.; a < naa; a ++) {
    rd = vuMat * normalize (vec3 (uv + step (1.5, naa) * Rot2D (vec2 (0.71 / canvas.y, 0.),
       0.5 * pi * (a + 0.5)), zmFac));
    col += (1. / naa) * ShowScene (ro, rd);
  }
  fragColor = vec4 (pow (clamp (col, 0., 1.), vec3 (0.8)), 1.);
}

float PrBoxDf (vec3 p, vec3 b)
{
  vec3 d;
  d = abs (p) - b;
  return min (max (d.x, max (d.y, d.z)), 0.) + length (max (d, 0.));
}

float PrRoundBoxDf (vec3 p, vec3 b, float r)
{
  return length (max (abs (p) - b, 0.)) - r;
}

float PrBox2Df (vec2 p, vec2 b)
{
  vec2 d;
  d = abs (p) - b;
  return min (max (d.x, d.y), 0.) + length (max (d, 0.));
}

float PrSphDf (vec3 p, float s)
{
  return length (p) - s;
}

float PrRoundCylDf (vec3 p, float r, float rt, float h)
{
  float dxy, dz;
  dxy = length (p.xy) - r;
  dz = abs (p.z) - h;
  return min (min (max (dxy + rt, dz), max (dxy, dz + rt)), length (vec2 (dxy, dz) + rt) - rt);
}

vec2 PixToHex (vec2 p)
{
  vec3 c, r, dr;
  c.xz = vec2 ((1./sqrt3) * p.x - (1./3.) * p.y, (2./3.) * p.y);
  c.y = - c.x - c.z;
  r = floor (c + 0.5);
  dr = abs (r - c);
  r -= step (dr.yzx, dr) * step (dr.zxy, dr) * dot (r, vec3 (1.));
  return r.xz;
}

vec2 HexToPix (vec2 h)
{
  return vec2 (sqrt3 * (h.x + 0.5 * h.y), (3./2.) * h.y);
}

vec3 HexGrid (vec2 p)
{
  vec2 q;
  p -= HexToPix (PixToHex (p));
  q = abs (p);
  return vec3 (p, 0.5 * sqrt3 - q.x + 0.5 * min (q.x - sqrt3 * q.y, 0.));
}

vec2 Rot2D (vec2 q, float a)
{
  vec2 cs;
  cs = sin (a + vec2 (0.5 * pi, 0.));
  return vec2 (dot (q, vec2 (cs.x, - cs.y)), dot (q.yx, cs));
}

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
}

vec3 HsvToRgb (vec3 c)
{
  return c.z * mix (vec3 (1.), clamp (abs (fract (c.xxx + vec3 (1., 2./3., 1./3.)) * 6. - 3.) - 1., 0., 1.), c.y);
}

const float cHashM = 43758.54;

float Hashff (float p)
{
  return fract (sin (p) * cHashM);
}
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
  vec2 e = vec2 (0.1, 0.);
  g = vec3 (Fbmn (p + e.xyy, n), Fbmn (p + e.yxy, n), Fbmn (p + e.yyx, n)) - Fbmn (p, n);
  return normalize (n + f * (g - n * dot (n, g)));
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}