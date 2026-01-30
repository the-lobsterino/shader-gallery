#extension GL_OES_standard_derivatives : enable

precision highp float;

float random(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

float map(float value, float start1, float stop1, float start2, float stop2) {
  return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

mat2 rotate2D(float rad) {
  return mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
}

mat2 scale2D(vec2 scale) {
  return mat2(scale.x, 0.0, 0.0, scale.y);
}

vec2 getNormalFromUV(vec2 uv) {
  float angle = atan(uv.y - 0.5, uv.x - 0.5);
  return normalize(vec2(cos(angle), sin(angle)));
}

float fresnel(float F0, vec3 viewDirection, vec3 worldNormal) {
  return F0 + (1.0 - F0) * pow(1.0 - dot(viewDirection, worldNormal), 5.0);
}

// // Description : Array and textureless GLSL 2D/3D/4D simplex noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//               https://github.com/stegu/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

float snoise01(vec3 v) {
  return (1.0 + snoise(v)) * 0.5;
}

uniform float time;
uniform float seed;
uniform float aspectRatio;
uniform sampler2D texture;
uniform vec2 mouse;
uniform vec2 resolution;
uniform vec3 normal;

uniform sampler2D blurTexture;

float stepedNoiseWave(vec2 v, float stepX, float stepY, float _seed) {
  float nx = 100.0 * (ceil(v.x * stepX) / stepX);
  float ny = 100.0 * (ceil(v.y * stepY) / stepY);
  float n = snoise(vec3(nx, ny, _seed));
  return n;
}

// vec2 uv = gl_FragCoord.xy / resolution;

vec2 getScaledUv(vec2 uv, float scale) {
  uv -= 0.5;
  uv *= scale2D(vec2(scale));
  uv += 0.5;
  return uv;
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 suv = vec2(uv.x, uv.y / 2.0);
  vec2 center = vec2(0.5, 0.5 / 2.0);

  float wave = sin(time * 0.5);
  wave = (wave + 1.0) * 0.5;

  float nd = 1.0 + 4.0 * wave;
  float n = snoise(vec3(suv.x * nd, suv.y * nd, time * 0.3));
  float n01 = (n + 1.0) * 0.5;

  float radius = 0.3;
  float d = 2.0 * length(suv - center - n * 0.05);
  float stepD = 1.0 - step(radius, d);

  float distortion = stepD * clamp(pow(d * 2.0, 5.0), 0.0, 1.0) * 20.0;
  float scale = stepD * (1.0 + distortion);
  scale += stepD * n * (0.5 + 1.5 * wave);

  float specular = stepD * clamp((d - (radius - 0.05)) * 20.0, 0.0, 1.0);
  specular = pow(specular, 5.0) * 0.25;

  distortion = clamp(distortion, 0.0, 1.0);

  float rScale = +0.006 * distortion;
  float bScale = -0.006 * distortion;

  vec2 ruv = getScaledUv(uv, 1.0 - (0.3 - rScale) * scale);
  vec2 guv = getScaledUv(uv, 1.0 - 0.3 * scale);
  vec2 buv = getScaledUv(uv, 1.0 - (0.3 - bScale) * scale);

  float r = texture2D(texture, ruv).r;
  float g = texture2D(texture, guv).g;
  float b = texture2D(texture, buv).b;
  vec4 color = vec4(r, g, b, 1.0);

  float br = texture2D(blurTexture, ruv).r;
  float bg = texture2D(blurTexture, guv).g;
  float bb = texture2D(blurTexture, buv).b;
  vec4 blurColor = vec4(br, bg, bb, 1.0);

  color = mix(color, blurColor, distortion);

  float glow = 2.0 * pow(distortion, 5.0);
  color.rgb *= 1.0 + glow;
  color.rgb += specular * vec3(0.8, 0.9, 1.0);

  gl_FragColor = color;
}