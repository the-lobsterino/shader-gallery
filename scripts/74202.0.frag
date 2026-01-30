precision mediump float;

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



/******************
 * Constants
 ******************/
const float PI = 3.141592653589793238;

const int NUM = 7;
const float fNum = float(NUM);

// const vec3[] palette = vec3[](
//   vec3(0.933, 0.604, 0.604),
//   vec3(0.957, 0.647, 0.133),
//   vec3(0.996, 0.914, 0.302),
//   vec3(0.804, 0.898, 0.396),
//   vec3(0.494, 0.827, 0.918),
//   vec3(0.416, 0.592, 0.855),
//   vec3(0.757, 0.612, 0.906)
// );



/******************
 * Utils
 ******************/
/**
 * 円形のグラデーションマスク
 * @param {vec2} _uv テクスチャ座標
 * @param {vec2} _pos 円の中心座標
 * @param {float} _radius 円の半径
 * @param {float} _smooth smoothstep の係数
 */
float circleMask(vec2 _uv, vec2 _pos, float _radius, float _smooth) {
  vec2 diff = _uv - _pos;
  vec2 nDiff = normalize(diff);
  float dist = length(diff);
  float mask = clamp(_radius - dist, 0.0, 1.0);
  return smoothstep(0.0, _radius * _smooth, mask);
}

/**
 * 円（線）
 * @param {vec2} _uv テクスチャ座標
 * @param {vec2} _pos 円の中心
 * @param {float} _radius 円の半径
 * @param {float} _lineWidth 線の太さ
 */
float ring(vec2 _uv, vec2 _pos, float _radius, float _lineWidth) {
  float dist = length(_uv - _pos);
  return _lineWidth / abs(_radius - dist);
}

/**
 * clamp to 0.0 ~ 1.0
 * @param {float} _v
 * @return {float}
 */
float saturate(float _v) {
  return clamp(_v, 0.0, 1.0);
}
/**
 * clamp to 0.0 ~ 1.0
 * @param {vec2} _v
 * @return {vec2}
 */
vec2 saturate(vec2 _v) {
  return clamp(_v, 0.0, 1.0);
}
/**
 * clamp to 0.0 ~ 1.0
 * @param {vec3} _v
 * @return {vec3}
 */
vec3 saturate(vec3 _v) {
  return clamp(_v, 0.0, 1.0);
}
/**
 * clamp to 0.0 ~ 1.0
 * @param {vec4} _v
 * @return {vec4}
 */
vec4 saturate(vec4 _v) {
  return clamp(_v, 0.0, 1.0);
}


vec2 fixAspect(vec2 uv) {
	uv -= 0.5;
	uv.y /= resolution.x / resolution.y;
	uv += 0.5;
	return uv;
}



/******************
 * Noise3D
 ******************/
//
// Description : Array and textureless GLSL 2D/3D/4D simplex 
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : stegu
//     Lastmod : 20201014 (stegu)
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
     return mod289(((x*34.0)+10.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

// First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

// Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

// Permutations
  i = mod289(i); 
  vec4 p = permute( permute( permute( 
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

// Gradients: 7x7 points over a square, mapped onto an octahedron.
// The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

//Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

// Mix final noise value
  vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 105.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                dot(p2,x2), dot(p3,x3) ) );
}



void main( void ) {
	vec3 palette[7];
	palette[0] = vec3(0.933, 0.604, 0.604)*8.0;
	palette[1] = vec3(0.957, 0.647, 0.133)*8.0;
	palette[2] = vec3(0.996, 0.914, 0.302)*8.0;
	palette[3] = vec3(0.804, 0.898, 0.396)*8.0;
	palette[4] = vec3(0.494, 0.827, 0.918)*8.0;
	palette[5] = vec3(0.416, 0.592, 0.855)*8.0;
	palette[6] = vec3(0.757, 0.612, 0.906)*8.0;

	vec2 uv = gl_FragCoord.xy / resolution.xy;
	uv = fixAspect(uv);
	
	vec2 center = vec2(0.5, 0.5);
	vec2 diff = uv - center;
	float dist = length(diff);
	vec2 nDiff = normalize(diff);

	// 角度 -PI ~ PI を 0.0 ~ 1.0 に変換
	float angle = atan(nDiff.y, nDiff.x);
	float nAngle = (time * 0.05 + angle + PI) / (PI * 2.0);
	nAngle = fract(nAngle + time * 0.1);
	
	// 虹色
	vec3 rainbow = vec3(palette[NUM - 1]);
	for (int i = 0; i < NUM; ++i) {
		float stp = 1.0 / (fNum + 0.25);
		float start = float(i) * stp;
		float end = (float(i) + 1.4) * stp;
		float mask = smoothstep(start, end, nAngle);
		rainbow = mix(rainbow, palette[i], mask);
	}
	
	vec3 color = rainbow;
	
	// 中心にいくにつれて白くなるグラデ
	float haloRadius = 0.25+cos(time)*0.1;
	float mask2 = circleMask(uv, center, haloRadius, 1.0);
	color = mix(color, vec3(1.0), mask2);
	
	// 円形マスク
	float cMask = circleMask(uv, center, haloRadius, 1.0);
	
	// 後光マスク
	float godrayNoiseRadius = 3.0;
	float godrayAngle = angle;
	vec2 godrayNoisePos = vec2(cos(godrayAngle), sin(godrayAngle)) * godrayNoiseRadius;
	float godrayNoise = snoise(vec3(godrayNoisePos, time)) * 0.5 + 0.5;
	godrayNoise = saturate(godrayNoise);
	float godrayCircle = circleMask(uv, center, haloRadius * 0.5, 1.0);
	float godrayMask = saturate(godrayNoise + godrayCircle);// 中心が不自然になるので円マスクを加算
	
	color *= godrayMask;
	color *= cMask;

	gl_FragColor = vec4(color, 1.0);
}