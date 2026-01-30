#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define N 5.0

float fmod(float a, float b)
{
  return a - floor(a / b) * b;
}

void main() {
  vec2 p = gl_FragCoord.xy / resolution.x; 
  p.x *= 0.86602; // sqrt(3)/2倍

  float isTwo = fmod(floor(p.y * N), 2.0); // 偶数列目なら1.0、奇数列目なら0.0

  // xy座標0~1の正方形をタイル状に複数個並べる
  p = p * N;
  p.x += isTwo * 0.5; // 偶数列目を0.5ズラす
  p = fract(p);

  p.x = abs(0.5 - p.x); // x=0.5を軸として左右対称にする
  float w1 = max( p.x * 2.0 + p.y, 1.0 - p.y * 1.5 ); // 三角形
  float isInTriangle = step(p.x * 2.0 + p.y, 1.0); // 三角形の内部にある場合は1.0
  
  // 右上(左上)の三角形
  p.x = 0.5 - p.x; 
  p.y = 1.0 - p.y;
  float w2 = max( p.x * 2.0 + p.y, 1.0 - p.y * 1.5 );

  w1 = mix(1.0 - w2, 1.0 - w1, isInTriangle) / 0.6;
  gl_FragColor = vec4(vec3(w1*(.25-.25*cos(p.y*2.*3.14)+.25-.25*cos(p.x*2.*3.14))), 1.);
}