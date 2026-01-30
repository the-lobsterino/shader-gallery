/*
 * Original shader from: https://www.shadertoy.com/view/MdlfRl
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
// "Closely Watched Dolphins" by dr2 - 2017
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

float PrSphDf (vec3 p, float r);
float PrSphAnDf (vec3 p, float r, float w);
float PrEllipsDf (vec3 p, vec3 r);
vec2 Rot2D (vec2 q, float a);
float SmoothMin (float a, float b, float r);
float SmoothBump (float lo, float hi, float w, float x);
vec3 HsvToRgb (vec3 c);
float Hashfv2 (vec2 p);
vec3 Hashv3f (float p);
vec3 VaryNf (vec3 p, vec3 n, float f);

#define N_FISH 2
#define SQRT3 1.73205

vec3 fishPos[N_FISH], vuPos = vec3(0.), sunDir = vec3(0.), cHit = vec3(0.), cHitP = vec3(0.), qnHit = vec3(0.), qHit = vec3(0.);
float fishAngH[N_FISH], fishAngV[N_FISH], fishAngI = 0., tCur = 0., dstFar = 0.;
int idObj = 0;
const float hcScale = 20.;
const vec3 hcSize = vec3 (0.5 * SQRT3, 1., 1.3);
const vec3 bcSize = vec3 (0.5, 1., 0.5);
const float pi = 3.14159;

vec3 TrackPath (float t)
{
  return vec3 (4. * sin (0.08 * t) + 1.5 * sin (0.11 * t),
     2. * sin (0.09 * t) + 0.4 * sin (0.13 * t), t);
}

vec2 PixToHex (vec2 p)
{
  vec2 c, r, dr;
  c = vec2 ((2. / SQRT3) * p.x, p.y);
  r = floor (c);
  r += mod (vec2 (r.x, r.y + step (2., mod (r.x + 1., 4.))), 2.);
  dr = c - r;
  r += step (1., 0.5 * dot (abs (dr), vec2 (SQRT3, 1.))) * sign (dr) * vec2 (2., 1.);
  return r;
}

bool HexCellFull (vec3 p)
{
  float hs, hb;
  p = (p * hcSize).yzx / hcScale;
  p.xy -= TrackPath (p.z).xy;
  p += 0.1 * (1. - cos (2. * pi * (p + 0.2 * (1. - cos (2. * pi * p.zxy)))));
  hs = length (cos (0.6 * p - 0.5 * sin (1.4 * p.zxy +
     0.4 * cos (2.7 * p.yzx)))) - 1.1;
  hb = 4. - p.y;
  idObj = (hs > hb) ? 0 : 1;
  return (min (hs, hb) < 0.);
}

float HexVolRay (vec3 ro, vec3 rd)
{
  vec3 ht, htt, w;
  vec2 hv[3], ve;
  float dHit, ty, dy;
  ro *= hcScale;
  cHit = vec3 (PixToHex (ro.zx), floor (ro.y / hcSize.z + 0.5));
  hv[0] = vec2 (0., 1.);
  hv[1] = vec2 (1., 0.5);
  hv[2] = vec2 (1., -0.5);
  for (int k = 0; k < 3; k ++)
     hv[k] *= sign (dot (hv[k], vec2 (0.5 * SQRT3 * rd.z, rd.x)));
  dy = sign (rd.y);
  qnHit = vec3 (0.);
  dHit = dstFar * hcScale + 0.01;
  for (int j = 0; j < 200; j ++) {
    w = ro - (cHit * hcSize).yzx;
    ht.z = 1e6;
    for (int k = 0; k < 3; k ++) {
      ve = vec2 (0.5 * SQRT3 * hv[k].x, hv[k].y);
      htt = vec3 (hv[k], (1. - dot (ve, w.zx)) / dot (ve, rd.zx));
      if (htt.z < ht.z) ht = htt;
    }
    ty = (0.5 * dy * hcSize.z - w.y) / rd.y;
    cHitP = cHit;
    if (ht.z < ty) cHit.xy += 2. * ht.xy;
    else cHit.z += dy;
    if (HexCellFull (cHit)) {
      if (ht.z < ty) {
        qnHit = - vec3 (0.5 * SQRT3 * ht.x, ht.y, 0.);
        dHit = ht.z;
      } else {
        qnHit = - vec3 (0., 0., dy);
        dHit = ty;
      }
      break;
    }
  }
  return dHit / hcScale;
}

float HexFaceDist (vec3 p)
{
  vec4 h[4];
  vec3 cNeb, vh;
  float d;
  p = p.zxy * hcScale - cHitP * hcSize;
  p.z *= 2. / hcSize.z;
  h[0] = vec4 (0., 1., 0., 1.);
  h[1] = vec4 (1., 0.5, 0., 1.);
  h[2] = vec4 (1., -0.5, 0., 1.);
  h[3] = vec4 (0., 0., 0.5, 0.5 * hcSize.z);
  d = 1e5;
  for (int k = 0; k < 4; k ++) {
    vh = h[k].xyz;
    cNeb = cHitP + 2. * vh;
    if (cNeb != cHit && HexCellFull (cNeb))
	d = min (d, h[k].w - dot (vh * hcSize, p));
    cNeb = cHitP - 2. * vh;
    if (cNeb != cHit && HexCellFull (cNeb))
	d = min (d, h[k].w + dot (vh * hcSize, p));
  }
  return d;
}

vec3 HexVolCol (vec3 p, float edgDist, float dHit)
{
  vec3 col;
  col = HsvToRgb (vec3 (Hashfv2 (cHit.xy), 0.5, 1.));
  col.r *= 0.1 + 0.9 * smoothstep (-0.5, 0.5, p.y) *
     (1. - smoothstep (0., 5., dHit));
  if (qnHit.z != 0.) col *= 0.7 + 0.3 * smoothstep (0., 0.7, abs (edgDist));
  return col;
}

float WatShd (vec3 rd)
{
  vec2 p;
  float t, h;
  p = 10. * rd.xz / rd.y;
  t = tCur * 2.;
  h = sin (p.x * 2. + t * 0.77 + sin (p.y * 0.73 - t)) +
     sin (p.y * 0.81 - t * 0.89 + sin (p.x * 0.33 + t * 0.34)) +
     (sin (p.x * 1.43 - t) + sin (p.y * 0.63 + t)) * 0.5;
  h *= smoothstep (0.5, 1., rd.y) * 0.04;
  return h;
}

float EdgeDist (vec3 p)
{
  vec2 dh;
  float d;
  p *= hcScale;
  dh = p.zx - cHit.xy * vec2 (0.5 * SQRT3, 1.);
  if (qnHit.z == 0.) {
    d = abs (fract (p.y / hcSize.z) - 0.5) * hcSize.z;
    dh -= qnHit.xy * dot (dh, qnHit.xy);
    d = min (d, abs (length (dh) - 1. / SQRT3));
  } else {
    dh = abs (dh);
    d = max (0.5 * dot (dh, vec2 (SQRT3, 1.)), dh.y) - 1.;
  }
  return d;
}

float FishDf (vec3 p)
{
  vec3 q;
  float dMin, dBodyF, dBodyB, dMouth, dFinT, dFinP, dFinD, dEye, d;
  p.x = abs (p.x);
  p.z -= 2.;
  p.yz = Rot2D (p.yz, 0.2 * fishAngI);
  q = p;
  q.z -= -0.6;
  dBodyF = PrEllipsDf (q, vec3 (0.7, 0.8, 2.4));
  q = p;
  q.z -= -1.2;
  q.yz = Rot2D (q.yz, fishAngI);
  q.z -= -1.6;
  dBodyB = PrEllipsDf (q, vec3 (0.35, 0.5, 2.5));
  q.z -= -2.2;
  q.yz = Rot2D (q.yz, 2. * fishAngI);
  q.xz -= vec2 (0.5, -0.5);
  q.xz = Rot2D (q.xz, 0.4);
  dFinT = PrEllipsDf (q, vec3 (0.8, 0.07, 0.4));
  q = p;
  q.yz -= vec2 (-0.3, 1.7);
  q.yz = Rot2D (q.yz, 0.1);
  q.y = abs (q.y) - 0.04;
  dMouth = PrEllipsDf (q, vec3 (0.25, 0.12, 0.6));
  q = p;
  q.yz -= vec2 (0.7, -1.);
  q.yz = Rot2D (q.yz, 0.6);
  dFinD = PrEllipsDf (q, vec3 (0.05, 1., 0.35));
  q = p;
  q.xy = Rot2D (q.xy, 0.8);
  q.xz -= vec2 (0.7, -0.1);
  q.xz = Rot2D (q.xz, 0.6);
  dFinP = PrEllipsDf (q, vec3 (0.9, 0.04, 0.3));
  q = p;
  q -= vec3 (0.4, -0.1, 1.1);
  dEye = PrEllipsDf (q, vec3 (0.11, 0.15, 0.15));
  idObj = 11;
  dMin = SmoothMin (dBodyF, dBodyB, 0.3);
  dMin = SmoothMin (dMin, dFinT, 0.1);
  dMin = SmoothMin (dMin, dMouth, 0.15);
  dMin = SmoothMin (dMin, dFinD, 0.02);
  dMin = SmoothMin (dMin, dFinP, 0.02);
  if (dEye < dMin) idObj = 12;
  dMin = SmoothMin (dMin, dEye, 0.01);
  qHit = q;
  return dMin;
}

float ObjDf (vec3 p)
{
  vec3 q, qHitA;
  float dMin, d, szFac;
  int idObjA;
  szFac = 8.;
  dMin = dstFar * szFac;
  for (int k = 0; k < N_FISH; k ++) {
    q = (p - fishPos[k]) * szFac;
    q.xz = Rot2D (q.xz, fishAngH[k]);
    q.yz = Rot2D (q.yz, fishAngV[k]);
    d = FishDf (q);
    if (d < dMin) {
      idObjA = idObj;
      qHitA = qHit;
      dMin = d;
    }
  }
  idObj = idObjA;
  qHit = qHitA;
  return dMin / szFac;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 150; j ++) {
    d = ObjDf (ro + rd * dHit);
    if (d < 0.001 || dHit > dstFar) break;
    dHit += d;
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

float ObjSShadow (vec3 ro, vec3 rd)
{
  float sh, d, h;
  sh = 1.;
  d = 1.;
  for (int j = 0; j < 30; j ++) {
    h = ObjDf (ro + rd * d);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += 0.08 * (1. + 0.1 * d);
    if (sh < 0.05) break;
  }
  return 0.3 + 0.7 * sh;
}

float BubDf (vec3 p, vec3 vr)
{
  float s, d, a;
  vr -= 0.5;
  s = fract (64. * dot (vr, vec3 (1.)));
  d = 0.1 * s * abs (vr.x * sin (3. * pi * s * (tCur + vr.y)));
  a = 0.03 * pi * vr.z * tCur;
  p.xz -= d * vec2 (cos (a), sin (a));
  p.y -= bcSize.y * vr.x;
  return PrSphDf (p, 0.01 * (1. - 0.7 * s));
}

const vec3 bHash = vec3 (1., 57., 113.);

float BObjRay (vec3 ro, vec3 rd)
{
  vec3 p, cId, vr, s;
  float dHit, d;
  dHit = 0.1;
  for (int j = 0; j < 120; j ++) {
    p = ro + rd * dHit;
    p.y -= 0.5 * tCur;
    cId = floor (p / bcSize);
    vr = Hashv3f (dot (cId, bHash));
    d = (vr.x > 0.5) ? BubDf (p - bcSize * (cId + 0.5), vr) : dstFar;
    s = (bcSize * (cId + step (0., rd)) - p) / rd;
    d = min (d, abs (min (min (s.x, s.y), s.z)) + 0.01);
    if (d < 0.0005 || dHit > dstFar) break;
    dHit += d;
  }
  return dHit;
}

float BObjDf (vec3 p)
{
  vec3 cId, vr;
  cId = floor (p / bcSize);
  vr = Hashv3f (dot (cId, bHash));
  return BubDf (p - bcSize * (cId + 0.5), vr);
}

vec3 BObjNf (vec3 p)
{
  vec4 v;
  vec3 e = vec3 (0.001, -0.001, 0.);
  p.y -= 0.5 * tCur;
  v = vec4 (BObjDf (p + e.xxx), BObjDf (p + e.xyy),
     BObjDf (p + e.yxy), BObjDf (p + e.yyx));
  return normalize (vec3 (v.x - v.y - v.z - v.w) + 2. * v.yzw);
}

float CageDf (vec3 p)
{
  p.xz = Rot2D (Rot2D (p.xz, 2. * pi * 0.5/12.), 2. * pi * (floor (12. *
     ((length (p.xz) > 0.) ? atan (p.z, - p.x) / (2. * pi) : 0.)) + 0.5) / 12.);
  p.z = abs (p.z);
  return max (PrSphAnDf (p, 0.05, 0.0001),
     min (abs (mod (p.y, 0.019) - 0.0095) - 0.0001,
     dot (p.xz, vec2 (sin (0.04 * 2. * pi / 24.), cos (0.04 * 2. * pi / 24.)))));
}

float CObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 100; j ++) {
    d = CageDf (ro + dHit * rd);
    dHit += d;
    if (d < 0.0001 || dHit > dstFar) break;
  }
  return dHit;
}

vec3 BgCol (vec3 rd)
{
  float t, gd, b;
  t = 4. * tCur;
  b = dot (vec2 (atan (rd.x, rd.z), 0.5 * pi - acos (rd.y)), vec2 (2., sin (rd.x)));
  gd = (clamp (sin (5. * b + t), 0., 1.) * clamp (sin (3.5 * b - t), 0., 1.) +
     clamp (sin (21. * b - t), 0., 1.) * clamp (sin (17. * b + t), 0., 1.)) *
     (1. - smoothstep (0.4, 0.6, rd.y));
  return vec3 (0.3, 1., 1.) * (0.1 + 0.225 * (rd.y + 1.) * (rd.y + 1.)) *
     (1. + 0.06 * gd);
}

float TurbLt (vec3 p, vec3 n, float t)
{
  vec2 q, qq, a1, a2;
  float c, tt;
  q = vec2 (dot (p.yzx, n), dot (p.zxy, n));
  q = 2. * pi * mod (q, 1.) - 256.;
  t += 11.;
  c = 0.;
  qq = q;
  for (float k = 1.; k <= 7.; k ++) {
    tt = t * (1. + 1. / k);
    a1 = tt - qq;
    a2 = tt + qq;
    qq = q + tt + vec2 (cos (a1.x) + sin (a2.y), sin (a1.y) + cos (a2.x));
    c += 1. / length (q / vec2 (sin (qq.x), cos (qq.y)));
  }
  return clamp (pow (abs (1.25 - abs (0.167 + 40. * c)), 8.), 0., 1.);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec3 col, bgCol, vn;
  float dstObj, dstBub, dstCage, dHit, dEdge, sh, diff, h, dFade, dm;
  dHit = HexVolRay (ro, rd);
  if (idObj == 0) dHit = dstFar;
  dstObj = ObjRay (ro, rd);
  dstBub = BObjRay (ro, rd);
  if ((ro + dstBub * rd).y > 4.) dstBub = dstFar;
  dstCage = CObjRay (ro - vuPos, rd);
  bgCol = BgCol (rd);
  col = bgCol;
  dm = min (dstCage, dstObj);
  if (min (min (dstBub, dm), dHit) < dstFar) {
    if (min (dstBub, dm) < dHit) {
      if (dm < dstBub) {
        if (dstObj < dstCage) {
          ro += dstObj * rd;
          vn = ObjNf (ro);
          if (idObj == 11) col = vec3 (0.6, 0.6, 1.) *
             (1. - 0.4 * smoothstep (-0.5, -0.4, vn.y));
          else if (idObj == 12) col = vec3 (1., 0.8, 0.2) *
             step (0.05, length (qHit.yz - vec2 (-0.02, 0.05)));
          col = col * (0.2 + 0.8 * max (dot (vn, sunDir), 0.)) +
             0.1 * pow (max (dot (normalize (sunDir - rd), vn), 0.), 64.);
          dHit = dstObj;
          dFade = 0.2;
        } else {
          ro += dstCage * rd;
          vn = - normalize (ro - vuPos);
          col = vec3 (0.35, 0.3, 0.3) * (0.6 + 0.4 * max (dot (vn, sunDir), 0.));
          dHit = dstCage;
          dFade = 0.2;
        }
      } else {
        ro += dstBub * rd;
        vn = BObjNf (ro);
        col = mix ((0.5 - 0.5 * dot (rd, vn)) * vec3 (0.4, 0.6, 0.8),
           BgCol (reflect (rd, vn)), 0.5) +
           0.2 * pow (max (dot (normalize (sunDir - rd), vn), 0.), 128.);
        dHit = dstBub;
        dFade = 0.05;
      }
    } else {
      ro += rd * dHit;
      vn = qnHit.yzx;
      dEdge = EdgeDist (ro);
      h = smoothstep (0., 0.1, HexFaceDist (ro));
      col = HexVolCol (ro, dEdge, dHit) * (0.7 + 0.3 * h);
      diff = clamp (dot (sunDir, vn), 0., 1.);
      sh = (diff > 0. && HexVolRay (ro + 0.001 * vn, sunDir) < dstFar) ? 0.6 : 1.;
      sh = min (sh, ObjSShadow (ro, sunDir));
      col = col * (0.2 + 0.8 * sh * diff) + 0.2 * sh * step (0.1, diff) *
         pow (max (dot (normalize (sunDir - rd), vn), 0.), 128.);        
      dFade = 0.05;
      col += 0.3 * TurbLt (0.8 * ro, abs (vn), 0.3 * tCur) *
         smoothstep (-0.3, -0.1, vn.y);
    }
    col = mix (col, bgCol, smoothstep (dFade, 0.85, dHit / dstFar));
  } else col = bgCol + WatShd (rd);
  return col;
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, fpF, fpB, vd, u, fpNear;
  vec2 canvas, uv, ori, ca, sa;
  float el, az, zmFac, vMov, vFish, tGap, t, a, d, f, aHlx, fHlx, fDist;
  bool fishLook;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  az = 0.;
  el = -0.1 * pi;
  fishLook = true;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += 0.95 * pi * mPtr.y;
    fishLook = false;
  }
  dstFar = 15.;
  zmFac = 1.8;
  vMov = 0.5;
  aHlx = 0.45;
  fHlx = 0.2 * vMov;
  fpF = TrackPath (vMov * tCur + 0.5);
  fpB = TrackPath (vMov * tCur - 0.5);
  vuPos = 0.5 * (fpF + fpB);
  vuPos.xy += 0.6 * aHlx * vec2 (cos (fHlx * tCur), sin (fHlx * tCur));
  ro = vuPos;
  if (! fishLook) {
    vd = fpF - fpB;
    t = length (vd);
    if (t > 0.) vd = normalize (vd);
    ori = vec2 (el + sin (vd.y), az + ((t > 0.) ? atan (vd.x, vd.z) : 0.5 * pi));
    ca = cos (ori);
    sa = sin (ori);
    vuMat = mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
            mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
  }
  vFish = 1.;
  tGap = 2. * dstFar / (float (N_FISH) * vFish);
  fDist = dstFar;
  for (int k = 0; k < N_FISH; k ++) {
    t = tGap * ((float (k) + floor (ro.z / (tGap * vFish) + 0.5)) -
       mod (tCur / tGap, 1.));
    fpF = TrackPath (t * vFish + 0.2);
    fpB = TrackPath (t * vFish - 0.2);
    fishPos[k] = 0.5 * (fpF + fpB);
    fishPos[k].xy -= aHlx * vec2 (cos (fHlx * t), sin (fHlx * t));
    vd = fpF - fpB;
    t = length (vd);
    if (t > 0.) vd = normalize (vd);
    fishAngH[k] = pi + ((t > 0.) ? atan (vd.x, vd.z) : 0.5 * pi);
    fishAngV[k] = - sin (vd.y);
    if (fishLook) {
      d = length (fishPos[k] - ro);
      if (d < fDist) {
        fDist = d;
        fpNear = fishPos[k];
      }
    }
  }
  if (fishLook) {
    vd = normalize (fpNear - ro);
    u = - vd.y * vd;
    f = 1. / sqrt (1. - vd.y * vd.y);
    vuMat = mat3 (f * vec3 (vd.z, 0., - vd.x), f * vec3 (u.x, 1. + u.y, u.z), vd);
  }
  fishAngI = 0.15 * sin (pi * tCur);
  uv += sin (2. * pi * (5. * uv + 0.5 * sin (0.4 * pi * tCur))) / canvas.y;
  rd = vuMat * normalize (vec3 (uv, zmFac));
  sunDir = normalize (vec3 (cos (0.002 * pi * tCur), 2., sin (0.002 * pi * tCur)));
  fragColor = vec4 (pow (clamp (ShowScene (ro, rd), 0., 1.), vec3 (0.8)), 1.);
}

float PrSphDf (vec3 p, float r)
{
  return length (p) - r;
}

float PrSphAnDf (vec3 p, float r, float w)
{
  return abs (length (p) - r) - w;
}

float PrEllipsDf (vec3 p, vec3 r)
{
  return (length (p / r) - 1.) * min (r.x, min (r.y, r.z));
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

vec3 HsvToRgb (vec3 c)
{
  vec3 p;
  p = abs (fract (c.xxx + vec3 (1., 2./3., 1./3.)) * 6. - 3.);
  return c.z * mix (vec3 (1.), clamp (p - 1., 0., 1.), c.y);
}

const vec4 cHashA4 = vec4 (0., 1., 57., 58.);
const vec3 cHashA3 = vec3 (1., 57., 113.);
const float cHashM = 43758.54;

float Hashfv2 (vec2 p)
{
  return fract (sin (dot (p, cHashA3.xy)) * cHashM);
}

vec3 Hashv3f (float p)
{
  return fract (sin (vec3 (p, p + 1., p + 2.)) *
     vec3 (cHashM, cHashM * 0.43, cHashM * 0.37));
}

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
  g = vec3 (Fbmn (p + e.xyy, n), Fbmn (p + e.yxy, n), Fbmn (p + e.yyx, n)) -
     Fbmn (p, n);
  return normalize (n + f * (g - n * dot (n, g)));
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}