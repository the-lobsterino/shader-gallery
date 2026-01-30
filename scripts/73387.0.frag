#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// shadertoy emulation
#define iTime time
#define iResolution resolution
vec4 iMouse = vec4(0.);



// "Piz Gloria With Helicopter" by dr2 - 2021
// License: Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License

// Perhaps Mr. Bond is trying to land on the Schilthorn?

// Note: high frame rate needed to avoid rotor artifacts (alternative is semi-opaque
// disk, as for propellers in e.g. "River Flight 2").

float PrRoundBoxDf (vec3 p, vec3 b, float r);
float PrRoundBox2Df (vec2 p, vec2 b, float r);
float PrCylDf (vec3 p, float r, float h);
float PrCapsDf (vec3 p, float r, float h);
float PrRoundCylDf (vec3 p, float r, float rt, float h);
float SmoothMin (float a, float b, float r);
float SmoothMax (float a, float b, float r);
float SmoothBump (float lo, float hi, float w, float x);
mat3 StdVuMat (float el, float az);
vec2 Rot2D (vec2 q, float a);
vec2 Rot2Cs (vec2 q, vec2 cs);
float Noisefv2 (vec2 p);
float Fbm2 (vec2 p);
vec3 VaryNf (vec3 p, vec3 n, float f);

mat3 flMat;
vec3 flPos, sunDir, qHit;
vec2 csRotor;
float tCur, dstFar, grndScl, bldgScl, heliScl;
int idObj;
bool isSh;
const int idPk = 1, idBldg = 2, idWin = 3, idPol = 4, idBase = 5, idBaseH = 6, idBrg = 7,
   idHeli = 11, idRotorM = 12, idRotorT = 13, idSkd = 14;
const float pi = 3.1415927;

#define VAR_ZERO min (iFrame, 0)

#define DMIN(id) if (d < dMin) { dMin = d;  idObj = id; }
#define DMINQ(id) if (d < dMin) { dMin = d;  idObj = id;  qHit = q; }

float GrndDf (vec3 p)
{   // (annular mountains from "Mountain Lake with Tower")
  vec3 q;
  float d, h, a, r, s, f;
  q = p / grndScl;
  r = length (q.xz);
  q.xz =Rot2D(q.xz,3.14*sin(tCur*0.1));
  
  d = p.y;
  if (r > 0.) {
    a = atan (q.z, - q.x) / (2. * pi) + 0.5;
    s = sqrt (r) / (2. * pi);
    f = 30. ; // de22.;
    h = 6.*(0.50+0.87*sin(tCur*0.1)) * s * mix (Fbm2 (f * vec2 (s, a + 1.)), Fbm2 (f * vec2 (s, a)), a);
    d = max (r - 20., q.y - mix (4. * s, h, smoothstep (1.4, 2.2, r)) * smoothstep (1.4, 2.6, r));
  }
  return grndScl * d;
}

float GrndRay (vec3 ro, vec3 rd)
{
  vec3 p;
  float dHit, h, s, sLo, sHi;
  s = 0.;
  sLo = 0.;
  dHit = dstFar;
  for (int j = 0; j < 160; j ++) {
    p = ro + s * rd;
    h = GrndDf (p);
    if (h < 0.) break;
    sLo = s;
    s += max (0.001, h);
    if (s > dstFar) break;
  }
  if (h < 0.) {
    sHi = s;
    for (int j = 0; j < 10; j ++) {
      s = 0.5 * (sLo + sHi);
      p = ro + s * rd;
      if (GrndDf (p) > 0.) sLo = s;
      else sHi = s;
    }
   //   dHit = 0.5 * (sLo + sHi);  //Ground deleat
      dHit = 0.5 * (sLo + sHi);
  }
  return dHit;
}

vec3 GrndNf (vec3 p)
{
  vec4 v;
  vec2 e;
  e = vec2 (0.001, -0.001);
  for (int j = 0; j < 4; j ++) {
    v[j] = GrndDf (p + ((j < 2) ? ((j == 0) ? e.xxx : e.xyy) : ((j == 2) ? e.yxy : e.yyx)));
  }
  v.x = - v.x;
  return normalize (2. * v.yzw - dot (v, vec4 (1.)));
}

float FlyerDf (vec3 p, float dMin)
{
  vec3 q;
  float d, r, s;
  dMin /= heliScl;
  p /= heliScl;
  if (! isSh) d = PrRoundBoxDf (p - vec3 (0., 0.5, -1.2), vec3 (4.5, 2., 5.5), 0.1);
  if (isSh || d < 0.1) {
    q = p;
    r = 1.;
    if (q.z < -0.1) {
      s = (q.z + 0.1) * (q.z + 0.1);
      r *= 1. - 0.1 * s;
      q.y -= 0.05 * s;
    } else if (q.z > 0.1) {
      s = (q.z - 0.1) * (q.z - 0.1);
      r *= 1. - 0.03 * s;
    }
    q.x *= 0.8;
    d = PrCapsDf (q, max (r, 0.), 2.8);  // main body de 2.0
    q = p;
    q.yz = Rot2D (q.yz - vec2 (1.1, -4.2), -0.05 * pi);
    r = 0.2 * (1. + 0.25 * q.z);
    q.y *= 0.7;
    d = min (d, PrCapsDf (q, r, 1.5));    // tail body  de1.5
    q = p;
    q.yz -= vec2 (1.7, -0.2);
    d = min (d, PrCylDf (q.xzy, 0.4, 0.4));
    q = p;
    q.yz -= vec2 (0.4, -1.);
    r = 1.1;
    if (q.z < 0.) {
      s = q.z * q.z;
      r *= 1. - 0.2 * s;
      q.y -= 0.1 * s;
    }
    q.y *= 0.8;
    d = SmoothMin (d, PrCapsDf (q, max (r, 0.), 1.5), 0.03);
    q = p;
    q.yz -= vec2 (1.4, -6.15);
    d = min (d, max (PrRoundCylDf (q.yzx, 0.65, 0.05, 0.02), 0.435 - length (q.yz)));
    DMIN (idHeli);
    if (! isSh) {
      q.yz = Rot2Cs (q.yz, csRotor);
      d = PrRoundBoxDf (q, vec3 (0.01, 0.432, 0.04), 0.02);
      DMIN (idRotorT);
    }
    q = p;
    q.yz -= vec2 (2., -0.2);
    d = PrCylDf (q.xzy, 0.12, 0.5);
    if (! isSh) {
      q.y -= 0.4;
      q.xz = Rot2Cs (q.xz, csRotor);
      d = min (d, PrRoundBoxDf (q, vec3 (4.5, 0.02, 0.08), 0.03));
    }
    DMIN (idRotorM);
    q = p;
    q.x = abs (q.x);
    q.xy -= vec2 (0.9, -1.4);
    d = PrRoundBoxDf (q, vec3 (0.1, 0.01, 1.4), 0.04);
    q.xy = Rot2D (q.xy, -0.1 * pi);
    q.z = abs (q.z);
    q.yz -= vec2 (0.4, 0.7);
    d = min (d, PrCylDf (q.xzy, 0.06, 0.4));
    DMIN (idSkd);
    dMin *= 0.7;
  } else dMin = min (dMin, d);
  return heliScl * dMin;
}

float BldgDf (vec3 p, float dMin)
{
  vec3 q;
  float d, a, hPk, hb, bs;
  p /= bldgScl;
  dMin /= bldgScl;
  hPk = 6.;
  q = p;
  q.x = abs (q.x);
  q.xy -= vec2 (0.8, 0.5 * hPk);
  a = atan (q.z, - q.x) / (2. * pi) + 0.5;
  q.xz = Rot2D (q.xz, 2. * pi * floor (33. * a + 0.5) / 33.);
  q.xy = Rot2D (q.xy, -0.2 * pi);
  d = length (q.xz) - 3.3 + p.y * (hPk - p.y) / (hPk * hPk) -
     0.5 * Fbm2 (vec2 (32. * mod (a + 0.5, 1.), 0.8 * q.y));
  d = SmoothMax (d, p.y - hPk, 0.1);
  hb = 0.6;
  q = p;
  q.y -= -0.11;
  d = 0.8 * SmoothMin (d, PrCylDf (q.xzy, 10., 0.1), 0.5);
//  DMINQ (idPk);   //   (1)
  q = p;
  q.xy -= vec2 (1.4, hPk + hb + 0.3);
  d = PrCapsDf ((q - vec3 (0., 0.8, 0.)).xzy, 0.35, 0.1);
//  DMINQ (idPol);         // (6)
  q.xz = Rot2D (q.xz, 2. * pi * floor (8. * (atan (q.z, - q.x) / (2. * pi) + 0.5) + 0.5) / 8.);
  bs = dot (q.xy, sin (0.04 * pi + vec2 (0.5 * pi, 0.))) - 0.9;
  d = SmoothMax (bs, max (- PrRoundBox2Df (q.yz - vec2 (-0.12, 0.), vec2 (0.47, 0.27 - 0.03 * q.y), 0.02),
     dot (q.yx, sin (0.08 * pi + vec2 (0.5 * pi, 0.))) - hb - 0.08), 0.02);
 // DMINQ (idBldg);    //  (2)
  d = min (d, max (bs /*+ 0.02*/, /*abs(q.y + 0.1)*/ - 0.5));
  DMINQ (idWin);   //  (3)
  hb = 0.1;
  q = p;
  q.xy -= vec2 (1.4, hPk + hb);
  d = PrRoundCylDf (q.xzy, 1.4, 0.02, hb - 0.02);
 // DMINQ (idBase);     // (4)
  q = p;
  q.xy -= vec2 (-1.5, hPk + hb);
  d = PrRoundCylDf (q.xzy, 1., 0.02, hb - 0.02);
 // DMINQ (idBaseH);    //  (4) -1
  q = p;
  q.y -= hPk + 1.5 * hb;
  d = PrRoundBoxDf (q, vec3 (1., 0.5 * hb, 0.2) - 0.02, 0.02);
//  DMINQ (idBrg);     // (5)  Bridge
  return bldgScl * dMin;
}

float ObjDf (vec3 p)
{
  float dMin;
  dMin = dstFar;
  dMin = BldgDf (p, dMin);
  dMin = FlyerDf (flMat * (p - flPos), dMin);
  return dMin;
}

float ObjRay (vec3 ro, vec3 rd)
{
  vec3 p;
  float dHit, d;
  dHit = 0.;
  for (int j = 0; j < 160; j ++) {
    p = ro + dHit * rd;
    d = ObjDf (p);
    if (d < 0.001 || dHit > dstFar) break;
    dHit += d;
  }
  return dHit;
}

vec3 ObjNf (vec3 p)
{
  vec4 v;
  vec2 e;
  e = vec2 (0.001, -0.001);
  for (int j = 0; j < 4; j ++) {
    v[j] = ObjDf (p + ((j < 2) ? ((j == 0) ? e.xxx : e.xyy) : ((j == 2) ? e.yxy : e.yyx)));
  }
  v.x = - v.x;
  return normalize (2. * v.yzw - dot (v, vec4 (1.)));
}

float ObjSShadow (vec3 ro, vec3 rd, float dMax)
{
  float sh, d, h;
  sh = 1.;
  d = 0.01;
  for (int j = 0; j < 30; j ++) {
    h = ObjDf (ro + d * rd);
    sh = min (sh, smoothstep (0., 0.05 * d, h));
    d += max (0.1, h);
    if (sh < 0.05 || d > dMax) break;
  }
  return 0.6 + 0.4 * sh;
}

vec3 SkyCol (vec3 ro, vec3 rd)
{
  vec3 col, clCol;
  vec2 q;
  float f, fd, ff;    //de q=0.005*(  )
  q = 0.0105 * (ro.xz + 5. * tCur * vec2 (0.5, 2.) + ((200. - ro.y) / rd.y) * rd.xz);
  ff = Fbm2 (q);
  f = smoothstep (0.1, 0.8, ff);
  fd = smoothstep (0.1, 0.8, Fbm2 (q + 0.01 * sunDir.xz)) - f; // de(0.1,0.8,ff);
  clCol = (0.8 + 0.5 * ff) * (vec3 (0.7) - 0.7 * vec3 (0.3, 0.3, 0.2) * sign (fd) *
     smoothstep (0., 0.05, abs (fd)));
  fd = smoothstep (0.01, 0.1, rd.y);     //de ( 0.01,0.1,rd.y);
  col = mix (mix (vec3 (0.8, 0.8, 0.75), vec3 (0.4, 0.5, 0.8), 0.3 + 0.7 * fd), clCol,
     0.1 + 0.9 * f * fd);
  return col;
}

vec4 GrndCol (vec3 ro, vec3 vn)
{
  vec4 col4;
  float a;
  a = atan (ro.z, - ro.x);
  col4 = vec4 (0.9, 0.9, 0.9, 0.3);
  if (ro.y > 0.) {
    col4 = mix (col4, vec4 (0.85, 0.85, 0.85, 0.1), smoothstep (0.1, 0.25, 1. - vn.y));
    col4 = mix (col4, vec4 (0.75, 0.75, 0.75, 0.1), smoothstep (0.25, 0.6, 1. - vn.y));
    col4 = mix (col4, vec4 (1., 1., 1., 0.4), smoothstep (0.65, 0.95, ro.y / grndScl +
       0.2 * sin (8. * a)));
  }
  return col4;
}

vec3 ShowScene (vec3 ro, vec3 rd)
{
  vec4 col4;
  vec3 col, vn;
  float dstGrnd, dstObj, sh;
  bool isRefl;
  csRotor = sin (10.3 * pi * tCur + vec2 (0.5 * pi, 0.));
  isSh = false;
  dstObj = ObjRay (ro, rd);
  isRefl = false;
  if (dstObj < dstFar && idObj == idWin) {
    ro += dstObj * rd;
    vn = ObjNf (ro);
    rd = reflect (rd, vn);
    ro += 0.01 * rd;
    dstObj = ObjRay (ro, rd);
    isRefl = true;
  }
  dstGrnd = GrndRay (ro, rd);
  if (min (dstGrnd, dstObj) < dstFar) {
    if (dstGrnd < dstObj) {
      ro += dstGrnd * rd;
      vn = GrndNf (ro);
      vn = VaryNf (32. * ro / grndScl, vn, 1.);
      col4 = GrndCol (ro, vn);
    } else {
      ro += dstObj * rd;
      vn = ObjNf (ro);
      if (idObj < idHeli) {
        if (idObj == idPk) {
          vn = VaryNf (32. * ro, vn, 0.5);
          col4 = mix (vec4 (0.6, 0.6, 0.6, 0.1), vec4 (1., 1., 1., 0.2), smoothstep (0.2, 0.6, vn.y)) *
             (1. - 0.05 * Noisefv2 (8. * ro.xz));
          qHit = ro / bldgScl;
          col4 *= 0.6 + 0.4 * smoothstep (0., 0.1, min (length (qHit.xz - vec2 (1.4, 0.)) - 1.4,
             length (qHit.xz - vec2 (-1.5, 0.)) - 1.));
        } else if (idObj == idBldg) {
          col4 = vec4 (0.7, 0.7, 0.6, 0.1) * (0.93 + 0.07 * sin (64. * pi * qHit.y));
        } else if (idObj == idPol) {
          col4 = vec4 (0.7, 0.7, 0.6, 0.1);
        } else if (idObj == idBase || idObj == idBaseH || idObj == idBrg) {
          col4 = vec4 (0.6, 0.6, 0.65, 0.) * (1. - 0.05 * Noisefv2 (16. * ro.xz));
          if (idObj != idBrg) col4 *= 0.9 + 0.1 * sin (64. * pi * qHit.y);
          if (idObj == idBaseH) {
            qHit.xz = abs (qHit.xz);
            col4 = mix (vec4 (1., 1., 0.5, 0.1), col4, smoothstep (0., 0.02,
               min (max (qHit.x - 0.4, abs (qHit.z - 0.3)), max (qHit.x, qHit.z - 0.3)) - 0.07));
          }
        }
      } else {
        qHit = flMat * (ro - flPos) / heliScl;
        if (idObj == idHeli) {
          col4 = mix (vec4 (0., 0.5, 0.50, -1.0), vec4 (0.8, 0.3, 0.7, 0.2),
             smoothstep (0., 0.1042, abs (qHit.y) - 0.2104));
          if (length (vec2 (qHit.x, qHit.y / 0.8)) > 1.24 && qHit.y > 0.55 && qHit.z > -1.20 &&
             abs (abs (qHit.x) - 0.3)>0.05 
             && abs(abs(abs(qHit.z-0.082)-0.4623)) > 0.105) col4 = vec4 (0., 0.5, 0.5, -1.);
        } else if (idObj == idRotorM) {
          col4 = vec4 (0.8, 0.8, 0.9, 0.1);
          if (length (qHit.xz - vec2 (0., -0.2)) > 4.2) col4 = vec4 (1., 1., 0.2, 0.1);
        } else if (idObj == idRotorT) {
          col4 = vec4 (0.8, 0.8, 0.9, 0.1);
          if (length (qHit.yz - vec2 (1.4, -6.15)) < 0.06) col4 = vec4 (1., 1., 0.2, 0.1);
        } else if (idObj == idSkd) {
          col4 = vec4 (0.8, 0.8, 0.85, 0.1);
        }
      }
    }
    if (col4.a >= 0.) {
      isSh = true;
      sh = ObjSShadow (ro + 0.01 * vn, sunDir, 0.5 * grndScl);
      col = col4.rgb * (0.2 + 0.8 * sh * max (dot (vn, sunDir), 0.)) +
         col4.a * step (0.95, sh) * pow (max (dot (normalize (sunDir - rd), vn), 0.), 32.);
    } else col = mix (col4.rgb, SkyCol (ro, reflect (rd, vn)), 0.8);
  } else {
    col = SkyCol (ro, rd);
  }
  if (isRefl) col = mix (col, vec3 (0., 1., 1.), 0.1);
  return clamp (col, 0., 1.);
}

//------------------------------------ Snow ad
//------------------------------------
 float snow(vec2 uv,float scale)
{
    float time = iTime*0.75;     scale =7.0; 
	uv+=time/scale;
    uv.y+=time*2./scale;
    uv.x+=sin(uv.y+time*.5)/scale;
	uv*=scale;
    vec2 s=floor(uv);
    vec2 f=fract(uv);
    float k=3.0;
	vec2 p =.5+.35*sin(11.*fract(sin((s+scale)*mat2(7.0,3.0,6.0,5.0))*5.))-f;
    float d=length(p);
    k=min(d,k);
	k=smoothstep(0.,k,sin(f.x+f.y)*0.01);
   	return k;
}

vec3 _Snow(vec2 uv,vec3 background)  //  background =vec3 col;
{
	float c = snow(uv,30.)*.3;
	c+=snow(uv,20.)*.5;
 	c+=snow(uv,15.)*.8;
	c+=snow(uv,10.);
	c+=snow(uv,8.);
 	c+=snow(uv,6.);
	c+=snow(uv,5.);
    c +=snow(uv,3.);  ///////////////
    c +=snow(uv,2.);  //////////////
    c = clamp(c,0.0,1.0);
    vec3 scol = vec3(.7529,.90+abs(0.3*sin(tCur*0.3)),1.0);
    scol = mix(background,scol,c);
	return scol;
}
//----------------------------------------- snow END

void FlyerPM (float t)
{
  vec3 vd, cb, sb;
  float flPit, flYaw, flRol, vh;
 // flPos = vec3 (-1.5 * bldgScl, 6.7 * bldgScl + 2.7 * (1. + sin (0.3 * t)), 0.);
    flPos = vec3 (4.5 * bldgScl*sin(0.3*t), 6.7 * bldgScl + 2.7 * (1. + sin (0.3 * t)), 4.5 * bldgScl*cos(0.3*t));
    
  vd.xz = Rot2D (vec2 (1., 0.), 1.8 * pi * sin (0.03 * pi * t));
  vd.y = -0.07 * pi * cos (0.1 * pi * t);
  vh = length (vd.xz);
  if (vh > 0.) {
    flPit = atan (vd.y, vh);
    flYaw = 0.5 * pi - atan (vd.z, - vd.x);
  } else {
    flPit = 0.;
    flYaw = 0.5 * pi;
  }
  flRol = 0.1 * sin (1. * t);
  cb = cos (vec3 (flPit, flYaw, flRol));
  sb = sin (vec3 (flPit, flYaw, flRol));
  flMat = mat3 (1., 0., 0., 0., cb.x, - sb.x, 0., sb.x, cb.x) *
          mat3 (cb.z, - sb.z, 0., sb.z, cb.z, 0., 0., 0., 1.) *
          mat3 (cb.y, 0., - sb.y, 0., 1., 0., sb.y , 0., cb.y);
}

#define AA  0

void mainImage (out vec4 fragColor, in vec2 fragCoord)
{
  mat3 vuMat;
  vec4 mPtr;
  vec3 ro, rd, col;
  vec2 canvas, uv, uvv;
  float el, az, asp, zmFac, sr;
  canvas = iResolution.xy;
  uv = 2. * fragCoord.xy / canvas - 1.;
  uv.x *= canvas.x / canvas.y;
  tCur = iTime;
  mPtr = iMouse;
  mPtr.xy = mPtr.xy / canvas - 0.5;
  asp = canvas.x / canvas.y;
  az = 0.5 * pi;
  el = -0.05 * pi;
  if (mPtr.z > 0.) {
    az -= 2.2 * pi * mPtr.x;
    el -= 0.3 * pi * mPtr.y;
  } else {
    az -= 2. * pi * SmoothBump (0.25, 0.75, 0.25, mod (0.01 * tCur, 1.));
    el -= 0.04 * pi * sin (0.02 * pi * tCur);
  }
  el = clamp (el, -0.15 * pi, -0.01 * pi);
  vuMat = StdVuMat (el, az);
  grndScl = 50.;
  bldgScl = 4.;
  heliScl = 1.5;    // de 0.5;
  FlyerPM (tCur);
  ro = vuMat * vec3 (0., 0., -1.4) * grndScl;
  ro.y += 0.22 * grndScl + 4. * bldgScl;
  zmFac =   6. - 4. * cos (az + 0.5 * pi*tCur*0.01);
  dstFar = 10. * grndScl;
  sunDir = vuMat * normalize (vec3 (1., 2., -1.));
#if ! AA
  const float naa = 1.;
#else
  const float naa = 3.;
#endif  
  col = vec3 (0.);
  sr = 2. * mod (dot (mod (floor (0.5 * (uv + 1.) * canvas), 2.), vec2 (1.)), 2.) - 1.;
  for (float a = float (0); a < naa; a ++) {
    uvv = (uv + step (1.5, naa) * Rot2D (vec2 (0.5 / canvas.y, 0.),
       sr * (0.667 * a + 0.5) * pi)) / zmFac;
    rd = vuMat * normalize (vec3 ((2. * tan (0.5 * atan (uvv.x / asp))) * asp, uvv.y, 1.));
    col += (1. / naa) * ShowScene (ro, rd);
         
  }
  
  //--------------------------------- snow  
      col =_Snow(uv*0.8,col);
  //-------------------------------------- snow END    
     
  fragColor = vec4 (col, 1.);
}

float PrRoundBoxDf (vec3 p, vec3 b, float r)
{
  return length (max (abs (p) - b, 0.)) - r;
}

float PrRoundBox2Df (vec2 p, vec2 b, float r)
{
  return length (max (abs (p) - b, 0.)) - r;
}

float PrCylDf (vec3 p, float r, float h)
{
  return max (length (p.xy) - r, abs (p.z) - h);
}

float PrCapsDf (vec3 p, float r, float h)
{
  return length (p - vec3 (0., 0., h * clamp (p.z / h, -1., 1.))) - r;
}

float PrRoundCylDf (vec3 p, float r, float rt, float h)
{
  return length (max (vec2 (length (p.xy) - r, abs (p.z) - h), 0.)) - rt;
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
    iMouse = vec4(mouse * resolution, 1., 0.);
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
