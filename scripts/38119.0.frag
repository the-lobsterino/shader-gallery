#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// 波
vec3 wave(vec3 c, vec2 p, float t, float i) {
  // 大きい方の回転
  float r = sin(p.x * 2. + t * .8) * .31 + sin(p.x + t * .323) * .07 - .2;

  // 小さい方の半径
  float sr = .08 + pow(abs(sin((t * 2.37 + (i * -.7) + cos(t * .7)) * .4) * .3), 3.) * 6.;
  // 小さい方の回転
  float s = sin(p.x * 1.77 + t * .13 + i * .2) * sr;

  // 明るさ
  float b = max(pow(1. - abs(sin(p.x * 54.8 + i * 2.) + sin(p.x * 100.8 + i * 30. + (t + i * .001) * 3.)), 10.) * .001, .0001);

  return b / abs(p.y + s + r) * c * .8;
}

// 円
float circle(in vec2 p, in float r) {
  return abs(length(p) - r);
}

// 煙
vec3 smoke(vec3 c, vec2 p, float t, float i) {
  t = fract((t + (i * .362) ) * .1);

  // 座標
  float x = p.x + tan(i * 23.34387) + sin(i * 19.34387) + t - .7;
  float y = p.y + 1.7 - (t * 1.5);

  // 円
  float ci = 1.0 - smoothstep(-.2, .6, circle(vec2(x, y), .0));

  // 色
  vec3 cc = c * .3 * (1. - t);

  return cc * ci;
}

void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;

  const vec3 c = vec3(104., 238., 243.) / 255.;
  vec3 col = vec3(0., 0., 0.);

  const float n = 30.;
  for (float i = 0.; i < n; i++) {
    col = col + wave(c, p, time, i);
  }

  const float m = 50.;
  for (float j = 0.; j < m; j++) {
    col = col + smoke(c, p, time, j);
  }

  gl_FragColor = vec4(col, 1.);
}
