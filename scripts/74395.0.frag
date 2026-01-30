/*
 * Original shader from: https://www.shadertoy.com/view/NtjSW3
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
// "Spiraling In and Out" by dr2 - 2021
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

#define AA  1   // 0/1 - optional antialiasing

float PrRoundBoxDf (vec3 p, vec3 b, float r);
float PrRoundCylDf (vec3 p, float r, float rt, float h);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);

#define VAR_ZERO 0

vec3 ltDir = vec3(0.), qHit = vec3(0.);
float tCur = 0., dstFar = 0.;
int idObj;
const float pi = 3.1415927;

#define DMINQ(id) if (d < dMin) { dMin = d;  idObj = id;  qHit = q; }

float ObjDf (vec3 p)
{
  vec3 q;
  float dMin, d, r, a, s;
  dMin = dstFar;
  q = p;
  r = length (q.xz);
  if (r > 0.) {
    a = atan (q.z, q.x) / pi;
    q.xz = mod (vec2 (0.5 * (pi * log (r) - a) - 0.4 * tCur, -5. * a) + 0.5, 1.) - 0.5;
    q.y /= sqrt (r);
    q.y -= 0.15 - 0.01 / r;
    s = 0.25 * r;
    d = s * min (PrRoundBoxDf (q, vec3 (0.16, 0.12, 0.2), 0.02), 
       PrRoundCylDf (vec3 (q.x, q.y - 0.24, abs (q.z) - 0.1).xzy, 0.05, 0.01, 0.12));
    DMINQ (1);
    d = s * max (abs (abs (q.x) - 0.3) - 0.1, q.y + 0.06);
    DMINQ (2);
    d = s * min (PrRoundCylDf (vec3 (q.x - 0.3, q.y, mod (q.z - 0.3 * tCur + 0.25, 0.5) - 0.25).xzy,
       0.07, 0.01, 0.12),
       PrRoundCylDf (vec3 (q.x + 0.3, q.y, mod (q.z + 0.3 * tCur + 0.25, 0.5) - 0.25).xzy,
       0.07, 0.01, 0.12));
    DMINQ (3);
  }
  q = p;
  d = max (0., q.y);
  DMINQ (4);
  return dMin;
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
	rd = normalize(-ro*vec3(1.,-1.,1.))*3.;
  sh = 1.;
  d = 0.02;
  for (int j = VAR_ZERO; j < 64; j ++) {
    h = ObjDf (ro + d * rd);
    sh = min (sh, smoothstep (0., .0005 * d, h));
    d += h;
    if (sh < 0.025) break;
  }
  return 0.6 + 0.4 * sh *8.;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, vn;
  float dstObj, sh, nDotL;
  dstObj = ObjRay (ro, rd);
  if (dstObj < dstFar) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    if (idObj == 1) col4 = vec4 (0.2, 0.5, 1., 0.2) * (0.93 + 0.07 * cos (60. * pi * qHit.y));
    else if (idObj == 2) col4 = vec4 (0.5, 0.2, 0.1, 0.2);
    else if (idObj == 3) col4 = vec4 (1., 0.9, 0.9, 0.3) * (0.93 + 0.07 * cos (60. * pi * qHit.y));
    else if (idObj == 4) col4 = vec4 (0.3, 0.6, 0.3, 0.2);
    sh = ObjSShadow (ro + 0.01 * vn, ltDir);
    nDotL = max (dot (vn, ltDir), 0.);
    col = col4.rgb * (0.2 + 0.8 * sh * nDotL * nDotL) +
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
  vec3 ro, rd, vd, col;
  vec2 canvas, uv, uvv;
  float el, az, zmFac, asp, sr;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  asp = canvas.x / canvas.y;
  az = 0.03 * pi * tCur;
  el = -0.2 * pi;
  if (mPtr.z > 0.) {
    az += pi * mPtr.x;
    el += 0.25 * pi * mPtr.y;
  }
  el = clamp (el, -0.3 * pi, -0.17 * pi);
  vuMat = StdVuMat (el, az);
  ro = vuMat * vec3 (0., 1., -20.);
  zmFac = 2.5;
  dstFar = 100.;
  ltDir = vuMat * normalize (vec3 (1., 1., -1.));
#if ! AA
  const float naa = 1.;
#else
  const float naa = 3.;
#endif  
  col = vec3 (0.);
  sr = 2. * mod (dot (mod (floor (0.5 * (uv + 1.) * canvas), 2.), vec2 (1.)), 2.) - 1.;
  for (float a = float (VAR_ZERO); a < naa; a ++) {
    uvv = (uv + step (1.5, naa) * Rot2D (vec2 (0.5 / canvas.y, 0.), sr * (0.667 * a + 0.5) * pi)) / zmFac;
    rd = vuMat * normalize (vec3 (2. * tan (0.5 * atan (uvv.x / asp)) * asp, uvv.y, 1.));
    col += (1. / naa) * ShowScene (ro, rd);
  }
  fragColor = vec4 (col, 1.);
}

float PrRoundBoxDf (vec3 p, vec3 b, float r)
{
  return length (max (abs (p) - b, 0.)) - r;
}

float PrRoundCylDf (vec3 p, float r, float rt, float h)
{
 return length (max (vec2 (length (p.xy) - r, abs (p.z) - h), 0.)) - rt;
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

// --------[ Original ShaderToy ends here ]---------- //

void main(void)
{
    mainImage(gl_FragColor, gl_FragCoord.xy);
}