/*
 * Original shader from: https://www.shadertoy.com/view/3tScDc
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
#define iDate vec4(0.)

// --------[ Original ShaderToy begins here ]---------- //
// "Truchet Waves" by dr2 - 2020
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

#define AA  0    // optional antialiasing

float PrCylDf (vec3 p, float r, float h);
vec2 PixToHex (vec2 p);
vec2 HexToPix (vec2 h);
float HexEdgeDist (vec2 p);
float Minv3 (vec3 p);
float SmoothMin (float a, float b, float r);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);
float Hashfv2 (vec2 p);

mat3 flMat = mat3(0.);
vec3 ltDir = vec3(0.), flPos = vec3(0.);
vec2 gId = vec2(0.), cMid = vec2(0.);
float tCur = 0., dstFar = 0., hgSize = 0., wavHt = 0., cDir = 0., trWidf = 0., trHt = 0.;
int idObj = 0;
const float pi = 3.1415927, sqrt3 = 1.7320508;

#define DMIN(id) if (d < dMin) { dMin = d;  idObj = id; }

float ObjDf (vec3 p)
{
  vec3 q, w;
  vec2 s, r;
  float dMin, d, h, b;
  dMin = dstFar;
  p.xz -= cMid;
  q = p;
  q.xz = Rot2D (q.xz, 2. * pi * (floor (6. * atan (q.z, - q.x) / (2. * pi) + 0.5)) / 6.);
  d = abs (q.x) - 0.86 * hgSize;
  r = p.xz / hgSize;
  s = vec2 (0., - cDir);
  b = dot (s - r, s - r);
  w = vec3 (s, b);
  s = 0.5 * vec2 (sqrt3, cDir);
  b = dot (s - r, s - r);
  if (b < w.z) w = vec3 (s, b);
  s = 0.5 * vec2 (- sqrt3, cDir);
  b = dot (s - r, s - r);
  if (b < w.z) w = vec3 (s, b);
  h = - trHt * smoothstep (0.5 * trWidf, trWidf, abs (sqrt (w.z) - 0.5));
  d = max (d, abs (q.y - wavHt + h) - 0.15 + h);
  DMIN (1);
  q = p;
  q.y -= wavHt - 2.;
  d = PrCylDf (q.xzy, 0.5, 2.);
  DMIN (2);
  return 0.8 * dMin;
}

void SetTrConf ()
{
  vec2 u;
  cMid = HexToPix (gId * hgSize);
  cDir = 2. * step (Hashfv2 (gId), 0.5) - 1.;
  u = mod (0.1 * vec2 (cMid.x + cMid.y, cMid.x - cMid.y) * (1. + 0.3 * sin (0.2 * 2. * pi * cMid)) +
    0.1 * tCur, 1.) - 0.5;
  wavHt = 0.4 * dot (exp (-100. * u * u), vec2 (1.));
}

float ObjRay (vec3 ro, vec3 rd)
{
  vec3 vri, vf, hv, p;
  vec2 edN[3], pM, gIdP;
  float dHit, d, s, eps;
  if (rd.x == 0.) rd.x = 0.0001;
  if (rd.y == 0.) rd.y = 0.0001;
  if (rd.z == 0.) rd.z = 0.0001;
  eps = 0.0005;
  edN[0] = vec2 (1., 0.);
  edN[1] = 0.5 * vec2 (1., sqrt3);
  edN[2] = 0.5 * vec2 (1., - sqrt3);
  for (int k = 0; k < 3; k ++) edN[k] *= sign (dot (edN[k], rd.xz));
  vri = hgSize / vec3 (dot (rd.xz, edN[0]), dot (rd.xz, edN[1]), dot (rd.xz, edN[2]));
  vf = 0.5 * sqrt3 - vec3 (dot (ro.xz, edN[0]), dot (ro.xz, edN[1]),
     dot (ro.xz, edN[2])) / hgSize;
  pM = HexToPix (PixToHex (ro.xz / hgSize));
  hv = (vf + vec3 (dot (pM, edN[0]), dot (pM, edN[1]), dot (pM, edN[2]))) * vri;
  s = Minv3 (hv);
  gIdP = vec2 (-999.);
  dHit = 0.;
  for (int j = 0; j < 160; j ++) {
    p = ro + dHit * rd;
    gId = PixToHex (p.xz / hgSize);
    if (gId != gIdP) {
      gIdP = gId;
      SetTrConf ();
    }
    d = ObjDf (p);
    if (dHit + d < s) {
      dHit += d;
    } else {
      dHit = s + eps;
      pM += sqrt3 * ((s == hv.x) ? edN[0] : ((s == hv.y) ? edN[1] : edN[2]));
      hv = (vf + vec3 (dot (pM, edN[0]), dot (pM, edN[1]), dot (pM, edN[2]))) * vri;
      s = Minv3 (hv);
    }
    if (d < eps || dHit > dstFar) break;
  }
  if (d >= eps) dHit = dstFar;
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  vec2 e;
  e = vec2 (0.0005, -0.0005);
  for (int j = 0; j < 4; j ++) {
    v[j] = ObjDf (p + ((j < 2) ? ((j == 0) ? e.xxx : e.xyy) : ((j == 2) ? e.yxy : e.yyx)));
  }
  v.x = - v.x;
  return normalize (2. * v.yzw - dot (v, vec4 (1.)));
}

float ObjSShadow (vec3 ro, vec3 rd)
{
  vec3 p;
  vec2 gIdP;
  float sh, d, h;
  sh = 1.;
  d = 0.01;
  gIdP = vec2 (-99.);
  for (int j = 0; j < 30; j ++) {
    p = ro + d * rd;
    gId = PixToHex (p.xz / hgSize);
    if (gId.x != gIdP.x || gId.y != gIdP.y) {
      gIdP = gId;
      SetTrConf ();
    }
    h = ObjDf (p);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += 0.05;
    if (sh < 0.05) break;
  }
  return 0.5 + 0.5 * sh;
}

vec3 TruchCol (vec2 p)
{
  vec3 col, w;
  vec2 s;
  float a, d, b;
  p -= cMid;
  p /= hgSize;
  s = vec2 (0., - cDir);
  b = dot (s - p, s - p);
  w = vec3 (s, b);
  s = 0.5 * vec2 (sqrt3, cDir);
  b = dot (s - p, s - p);
  if (b < w.z) w = vec3 (s, b);
  s = 0.5 * vec2 (- sqrt3, cDir);
  b = dot (s - p, s - p);
  if (b < w.z) w = vec3 (s, b);
  w.z = abs (sqrt (w.z) - 0.5);
  d = HexEdgeDist (p);
  col = vec3 (0.5, 0.5, 1.) * mix (1., 0.7 + 0.3 * smoothstep (0.2, 0.8, d), smoothstep (0.02, 0.03, d));
  if (w.z < trWidf) {
    col = vec3 (1., 1., 0.);
    w.xy = Rot2D (w.xy - p, 0.5 * cDir * tCur);
    a = mod (3. * atan (cDir * w.y, - w.x) / pi, 1.) - 0.5;
    for (float s = 0.01; s >= 0.; s -= 0.01) {
      d = 1.;
      if (abs (a) - 0.15 < s) d = min (d, smoothstep (0., 0.005,
         w.z - 0.045 * (1. - a / 0.15) - 0.5 * s));
      if (abs (a + 0.3) - 0.15 < s) d = min (d, smoothstep (0., 0.005, w.z - 0.02 - s));
      if (abs (mod (2. * a + 0.5, 1.) - 0.5) - 0.4 < s)
         d = min (d, smoothstep (0., 0.005, abs (w.z - 0.135) - 0.01 - s));
      col = mix (vec3 (0., 1. - 70. * s, 0.), col, d);
    }
  }
  return col;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, vn;
  float dstObj, sh;
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    if (idObj == 1) {
      col4 = (vn.y > 0.01) ? vec4 (TruchCol (ro.xz), 0.1) :
         vec4 (0.8, 0.8, 0.9, 0.3) * (0.8 + 0.2 * cos (18. * pi * (ro.y - wavHt)));
    } else if (idObj == 2) {
      col4 = vec4 (0.3, 0.3, 0.4, 0.1);
    }
    sh = ObjSShadow (ro, ltDir);
    col = col4.rgb * (0.2 + 0.8 * sh * max (dot (vn, ltDir), 0.)) +
       col4.a * step (0.95, sh) * pow (max (dot (normalize (ltDir - rd), vn), 0.), 32.);
  } else col = vec3 (0.3, 0.3, 0.3);
  return clamp (col, 0., 1.);
}

vec3 TrackPath (float t)
{
  return t * vec3 (0.1, 0., sqrt (0.99)) + vec3 (2. * cos (0.1 * t), 0., 0.);
}

void VuPM (float t)
{
  vec3 fpF, fpB, vel, acc, va, ort, cr, sr;
  float dt;
  dt = 1.;
  flPos = TrackPath (t);
  fpF = TrackPath (t + dt);
  fpB = TrackPath (t - dt);
  vel = (fpF - fpB) / (2. * dt);
  vel.y = 0.;
  acc = (fpF - 2. * flPos + fpB) / (dt * dt);
  acc.y = 0.;
  va = cross (acc, vel) / length (vel);
  ort = vec3 (0.2, atan (vel.z, vel.x) - 0.5 * pi, 5. * length (va) * sign (va.y));
  cr = cos (ort);
  sr = sin (ort);
  flMat = mat3 (cr.z, - sr.z, 0., sr.z, cr.z, 0., 0., 0., 1.) *
     mat3 (1., 0., 0., 0., cr.x, - sr.x, 0., sr.x, cr.x) *
     mat3 (cr.y, 0., - sr.y, 0., 1., 0., sr.y, 0., cr.y);
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 dateCur;
  vec3 ro, rd, col;
  vec2 canvas, uv;
  float el, az, zmFac, sr;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  dateCur = iDate;
  tCur = mod (tCur, 2400.) + 30. * floor (dateCur.w / 7200.) + 11.1;
  hgSize = 2.;
  trWidf = 0.3;
  trHt = 0.07;
  VuPM (1. * tCur);
  az = 0.;
  el = -0.1 * pi;
  vuMat = StdVuMat (el, az);
  flPos.y += 10.;
  ro = flPos;
  zmFac = 6. + 3. * sin (0.02 * 2. * pi * tCur);
  dstFar = 100.;
  ltDir = normalize (vec3 (1., 1., -1.));
#if ! AA
  const float naa = 1.;
#else
  const float naa = 3.;
#endif  
  col = vec3 (0.);
  sr = 2. * mod (dot (mod (floor (0.5 * (uv + 1.) * canvas), 2.), vec2 (1.)), 2.) - 1.;
  for (float a = 0.; a < naa; a ++) {
    rd = normalize (vec3 (uv + step (1.5, naa) * Rot2D (vec2 (0.5 / canvas.y, 0.),
       sr * (0.667 * a + 0.5) * pi), zmFac));
    rd = vuMat * rd;
    rd = rd * flMat;
    col += (1. / naa) * ShowScene (ro, rd);
  }
  fragColor = vec4 (col, 1.);
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
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

float HexEdgeDist (vec2 p)
{
  p = abs (p);
  return (sqrt3/2.) - p.x + 0.5 * min (p.x - sqrt3 * p.y, 0.);
}

float Minv3 (vec3 p)
{
  return min (p.x, min (p.y, p.z));
}

float SmoothMin (float a, float b, float r)
{
  float h;
  h = clamp (0.5 + 0.5 * (b - a) / r, 0., 1.);
  return mix (b, a, h) - r * h * (1. - h);
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

float Hashfv2 (vec2 p)
{
  return fract (sin (dot (p, vec2 (37., 39.))) * cHashM);
}

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}