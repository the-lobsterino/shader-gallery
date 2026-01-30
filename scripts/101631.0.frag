/*
 * Original shader from: https://www.shadertoy.com/view/DtSXRc
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
// "This Is Not A Refracted Pipe" by dr2 - 2023
// License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0

/*
 Note from "This Is Not A Pipe":
  This is clearly not Magritte's masterpiece. But is the 3D form less
  'not a pipe' than the original?

 No. 27 in "Refraction" series - listed at end

 No. 4 in "Nonpipe" series
    "This Is Not A Pipe"              (4s3XD2)
    "This Is Not A Reflected Pipe"    (Wsd3W8)
    "This Is Not A Reflected Pipe 2"  (Nsd3RN)

 (with bits from "This Is Not A Reflected Pipe 2" and "Fugu Egg")
*/

#define AA  1  // (= 0/1) optional antialiasing

float PrCylDf (vec3 p, float r, float h);
float PrCapsDf (vec3 p, float r, float h);
float PrEllCylDf (vec3 p, vec2 r, float h);
float Minv2 (vec2 p);
float Maxv2 (vec2 p);
float SmoothMin (float a, float b, float r);
float SmoothMax (float a, float b, float r);
float SmoothBump (float lo, float hi, float w, float x);
vec2 Rot2D (vec2 q, float a);
vec2 Rot2Cs (vec2 q, vec2 cs);
mat3 StdVuMat (float el, float az);
float Fbm1 (float p);
float Fbm2 (vec2 p);
float Fbm3 (vec3 p);
vec3 VaryNf (vec3 p, vec3 n, float f);

vec3 ltDir = vec3(0.);
float dstFar = 0., tCur = 0., szFac = 0., sphRad = 0.;
int idObj = 0;
const int idPipe = 1, idCoal = 2;
const float pi = 3.1415927;

#if 0
#define VAR_ZERO min (iFrame, 0)
#else
#define VAR_ZERO 0
#endif

#define DMIN(id) if (d < dMin) { dMin = d;  idObj = id; }

float ObjDf (vec3 p)
{  // (from "This Is Not A Reflected Pipe 2")
  vec3 q;
  vec2 rp;
  float dMin, d;
  dMin = dstFar / szFac;
  p /= szFac;
  p.x += 1.;
  q = p;
  d = SmoothMax (abs (PrCapsDf (q.xzy, 0.55, 0.25)) - 0.06, q.y - 0.5, 0.05);
  q.y -= smoothstep (0.5, 2.5, q.x) - 0.5;
  q.x -= 1.3;
  rp = vec2 (0.1, 0.17) - vec2 (0.05, 0.06) * (q.x / 0.6 - 1.);
  d = SmoothMin (d, max (SmoothMin (PrEllCylDf (q.yzx, rp, 1.2),
     PrEllCylDf (q.yzx - vec3 (0., 0., 1.2), rp + 0.007, 0.007), 0.05),
     0.03 - length (q.yz * vec2 (1.1, 0.35))), 0.12);
  DMIN (idPipe);
  q = p;
  q.y -= 0.3;
  d = PrCylDf (q.xzy, 0.5, 0.01);
  DMIN (idCoal);
  return 0.7 * szFac * dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  float dHit, d;
  dHit = 0.;
  for (int j = VAR_ZERO; j < 160; j ++) {
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
  d = 0.02;
  for (int j = VAR_ZERO; j < 30; j ++) {
    h = ObjDf (ro + d * rd);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += 0.02;
    if (sh < 0.05) break;
  }
  return 0.6 + 0.4 * sh;
}

float InSphHit (vec3 ro, vec3 rd, float rad)
{
  float b, d;
  b = dot (rd, ro);
  d = b * b + rad * rad - dot (ro, ro);
  return (d > 0.) ? - b - sqrt (d) : dstFar;
}

float OutSphHit (vec3 ro, vec3 rd, float rad)
{
  float b, d;
  b = dot (rd, ro);
  d = b * b + rad * rad - dot (ro, ro);
  return (d > 0.) ? - b + sqrt (d) : dstFar;
}

vec3 BgCol (vec3 rd)
{
  vec3 col; 
  if (rd.y > 0.85) col = mix (vec3 (0.1), vec3 (0.9, 0.9, 1.), smoothstep (0., 0.02,
     0.47 - Maxv2 (abs (fract (8. * Rot2D (rd.xz / rd.y, 0.25 * pi) + 0.5) - 0.5))));
  else col = mix (vec3 (0.5, 0.5, 0.), vec3 (0.7, 0.9, 1.),  Minv2 (smoothstep (0.05, 0.1, 
     abs (sin (64. * atan (rd.zy, vec2 (rd.x, length (rd.xz)))))))) * (0.3 + 0.1 * rd.y);
  return clamp (col, 0., 1.);
}

vec3 ShowScene (vec3 ro, vec3 rd)
{  // (optics simplified from "Fugu Egg")
  vec3 col, rdo, vn, vnIn, q;
  float dstObj, dstSphIn, dstSphOut, eta, sh;
  szFac = 0.8;
  eta = 1. / (1. - 0.6 * SmoothBump (0.25, 0.75, 0.15, mod (0.05 * tCur, 1.)));
  rdo = rd;
  dstObj = dstFar;
  dstSphIn = InSphHit (ro, rd, sphRad);
  if (dstSphIn < dstFar) {
    ro += dstSphIn * rd;
    vnIn = ro / sphRad;
    rd = refract (rd, vnIn, 1. / eta);
    dstObj = ObjRay (ro, rd);
    dstSphOut = OutSphHit (ro, rd, sphRad);
    if (dstSphOut < dstObj) {
      ro += dstSphOut * rd;
      rd = refract (rd, - ro / sphRad, eta);
    }
  }
  if (dstObj < dstFar) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    q = ro / szFac;
    if (idObj == idPipe) {
      q.xy -= vec2 (0.4);
      q.xy = Rot2D (q.xy, -0.2 * pi);
      if (q.x < -0.03) vn = VaryNf (16. * q, vn, 0.1);
      col = mix ((q.x < 0.) ? mix (vec3 (0.6, 0.3, 0.), vec3 (0.3, 0.1, 0.), 0.5 * Fbm3 (4. * q)) :
         vec3 (0.1), vec3 (0.7, 0.6, 0.), SmoothBump (-0.03, 0.03, 0.01, q.x));
      sh = ObjSShadow (ro + 0.01 * vn, ltDir);
      col = col * (0.2 + 0.2 * max (- dot (vn, ltDir), 0.) + 0.8 * sh * max (dot (vn, ltDir), 0.)) +
         0.2 * step (0.95, sh) * pow (max (0., dot (ltDir, reflect (rd, vn))), 32.);
    } else if (idObj == idCoal) {
      col = mix (vec3 (0.9, 0., 0.) * (0.2 + 0.8 * smoothstep (0.1, 0.9, Fbm1 (0.5 * tCur))),
         vec3 (0.1, 0., 0.), smoothstep (0.2, 0.7, Fbm2 (64. * q.xz)));
    }
  } else {
    col = BgCol (rd);
  }
  if (dstSphIn < dstFar) col = mix (col, 2. * BgCol (reflect (rdo, vnIn)),
     0.05 + 0.95 * pow (1. - abs (dot (rdo, vnIn)), 5.));
  return clamp (col, 0., 1.);
}

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, col;
  vec2 canvas, uv;
  float el, az, zmFac, sr, t;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  az = 0.;
  el = -0.1 * pi;
  if (mPtr.z > 0.) {
    az += 2. * pi * mPtr.x;
    el += pi * mPtr.y;
  } else {
    t = mod (0.01 * tCur, 1.);
    t = (floor (32. * t) + smoothstep (0.5, 1., mod (32. * t, 1.))) / 32.;
    az = pi * sin (2. * pi * t);
    el = -0.2 * pi * sin (4. * pi * t);
  }
  vuMat = StdVuMat (el, az);
  sphRad = 2.;
  ro = vuMat * vec3 (0., 0., -5. * sphRad);
  zmFac = 4.5;
  dstFar = 30.;
  ltDir = vuMat * normalize (vec3 (1., 2., -1.));
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

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float PrCapsDf (vec3 p, float r, float h)
{
  return length (p - vec3 (0., 0., clamp (p.z, - h, h))) - r;
}

float PrEllCylDf (vec3 p, vec2 r, float h)
{
  return max ((length (p.xy / r) - 1.) * min (r.x, r.y), abs (p.z) - h);
}

float Minv2 (vec2 p)
{
  return min (p.x, p.y);
}

float Maxv2 (vec2 p)
{
  return max (p.x, p.y);
}

float SmoothMin (float a, float b, float r)
{
  float h;
  h = clamp (0.5 + 0.5 * (b - a) / r, 0., 1.);
  return mix (b - h * r, a, h);
}

float SmoothMax (float a, float b, float r)
{
  return - SmoothMin (- a, - b, r);
}

float SmoothBump (float lo, float hi, float w, float x)
{
  return (1. - smoothstep (hi - w, hi + w, x)) * smoothstep (lo - w, lo + w, x);
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

mat3 StdVuMat (float el, float az)
{
  vec2 ori, ca, sa;
  ori = vec2 (el, az);
  ca = cos (ori);
  sa = sin (ori);
  return mat3 (ca.y, 0., - sa.y, 0., 1., 0., sa.y, 0., ca.y) *
         mat3 (1., 0., 0., 0., ca.x, - sa.x, 0., sa.x, ca.x);
}

const float cHashM = 43758.54;

vec2 Hashv2f (float p)
{
  return fract (sin (p + vec2 (0., 1.)) * cHashM);
}

vec2 Hashv2v2 (vec2 p)
{
  vec2 cHashVA2 = vec2 (37., 39.);
  return fract (sin (dot (p, cHashVA2) + vec2 (0., cHashVA2.x)) * cHashM);
}

vec4 Hashv4v3 (vec3 p)
{
  vec3 cHashVA3 = vec3 (37., 39., 41.);
  return fract (sin (dot (p, cHashVA3) + vec4 (0., cHashVA3.xy, cHashVA3.x + cHashVA3.y)) * cHashM);
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

float Fbm1 (float p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int j = 0; j < 5; j ++) {
    f += a * Noiseff (p);
    a *= 0.5;
    p *= 2.;
  }
  return f * (1. / 1.9375);
}

float Fbm2 (vec2 p)
{
  float f, a;
  f = 0.;
  a = 1.;
  for (int j = 0; j < 5; j ++) {
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
  for (int j = 0; j < 5; j ++) {
    s += a * vec3 (Noisefv2 (p.yz), Noisefv2 (p.zx), Noisefv2 (p.xy));
    a *= 0.5;
    p *= 2.;
  }
  return dot (s, abs (n));
}

vec3 VaryNf (vec3 p, vec3 n, float f)
{
  vec4 v;
  vec3 g;
  vec2 e = vec2 (0.1, 0.);
  for (int j = VAR_ZERO; j < 4; j ++) {
    v[j] = Fbmn (p + ((j < 2) ? ((j == 0) ? e.xyy : e.yxy) : ((j == 2) ? e.yyx : e.yyy)), n);
  }
  g = v.xyz - v.w;
  return normalize (n + f * (g - n * dot (n, g)));
}

/*
  "Refraction" series
    "Aquarium"                    (Mtf3zM)
    "Wavescape"                   (lls3z7)
    "Sailing Home"                (Ml23WV)
    "Fishbowl"                    (MlSSDR)
    "A Few Fish"                  (4dtSDs)
    "Fishbowl 2"                  (lt3SW8)
    "Swimming Pool Waves"         (llKSDG)
    "Green Grotto"                (Ms2yR1)
    "Glass Duck"                  (XslBR8)
    "Foggy Duck"                  (XsfBWn)
    "Rainbow Cavern"              (XsfBWM)
    "Magic Orb"                   (XsfBWB)
    "Glass Duck 2"                (MtlyRf)
    "White Folly"                 (ll2cDG)
    "White Folly 2"               (ltXfzr)
    "Virtual Dolphins"            (XlfBD2)
    "Refractable Ship"            (MtjBRm)
    "Refracted Colliding Balls"   (lljBDR)
    "Refraction Exercise"         (4ddyRj)
    "Wrapped Bottle"              (wdS3zV)
    "Ship in a Bottle"            (wlXXzf)
    "Booze Cruise"                (3dsfWl)
    "Nautilus Submerging"         (WtXfR2)
    "Nautilus Interior"           (wt2fzz)
    "Nautilus at Sunset"          (slscWj)
    "Fugu Egg"                    (NtjcRV)
*/

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}