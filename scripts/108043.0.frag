#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/*
	Copyright (c) 2023
	LiJiYong studios
	contact@lijiyong.com
*/

float iTime = time;
vec2 i = resolution;
mat2 h(float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)); }
float n(float a) { return clamp(a, 0., 1.); }
vec3 t(vec3 a) { return clamp(a, 0., 1.); }
float x(float a, float b, float c) {
  float d = clamp(.5 + .5 * (b - a) / c, 0., 1.);
  return mix(b, a, d) - c * d * (1. - d);
}
float y(float a, float b, float c) { return -x(-a, -b, c); }
float o(vec3 a) {
  float b = abs(a.y) - .3;
  b = abs(b);
  return max(length(a.xz) - .5 * b, abs(a.y) - .3);
}
vec3 p(vec3 a) {
  for (float b = 0.; b < 12.; b++)
    a.xy = abs(a.xy), a.xy *= h(3.141593 * b / 12.);
  return a;
}
float l(vec3 a) {
  a.xz *= h(iTime), a.zy *= h(iTime);
  float b = .1;
  vec3 c = a, d = a;
  a = p(a), c.xz *= h(1.570796), c = p(c), d.yz *= h(1.570796), d = p(d),
  b = min(b, o(a)), b = min(b, o(c)), b = min(b, o(d)),
  b = y(b, -(length(a) - .15), .05);
  return b;
}
vec3 j(in vec3 b) {
  vec2 a = vec2(1, -1) * .5773;
  return normalize(a.xyy * l(b + a.xyy * 5e-4) + a.yyx * l(b + a.yyx * 5e-4) +
                   a.yxy * l(b + a.yxy * 5e-4) + a.xxx * l(b + a.xxx * 5e-4));
}
float z(vec3 a, vec3 b, vec3 c, float d) {
  return n(pow(dot(j(a), normalize(normalize(b) - c)), d));
}
float u(in vec3 f, in vec3 g, in float k, in float q, int r) {
  float b = 1., c = k, e = 1e+10;
  for (int m = 0; m < 32; m++) {
    float a = l(f + g * c);
    if (r == 0)
      b = min(b, 10. * a / c);
    else {
      float d = a * a / (2. * e), s = sqrt(a * a - d * d);
      b = min(b, 10. * s / max(0., c - d)), e = a;
    }
    c += a;
    if (b < 1e-4 || c > q)
      break;
  }
  b = clamp(b, 0., 1.);
  return b * b * (3. - 2. * b);
}
vec3 A(vec3 c) {
  vec3 k = vec3(0, 0, -1), d, a;
  float e, b;
  for (float f = 0.; f < 64.; f++)
    a = k + c * e, a = mod(a + .5, 1.) - .5, a = p(a), b = o(a), e += b;
  if (b < 1e-3) {
    float g = n(dot(j(a), vec3(.5, 1, -1)));
    d = vec3(.16, .73, .97) * g + reflect(j(a), normalize(c + g)) * .5;
  }
  return d;
}
vec3 B(vec3 a) { return a * (2.51 * a + .03) / (a * (2.43 * a + .59) + .14); }
float C(inout vec2 b, float d) {
  float a = 6.283185 / d, e = (atan(b.y, b.x) + a * .5) / a, c = floor(e),
        f = a * c;
  b *= h(f);
  return c;
}
vec3 D(vec3 a) {
  a.xz *= h(a.x);
  for (float b = 0.; b < 3.; b++)
    a.yz *= h(b), a.xy *= h(b * .5),
        a.x = abs(a.x) - b * .07, a.xz *= h(-.2 * b), a.z = abs(a.z) - b * .07;
  C(a.yz, 2.), a.y -= .05;
  return a;
}
vec3 v(float a) { return mix(vec3(.17, .98, .85), vec3(.16, .73, .97), a); }

vec4 E(in vec2 e) {
  vec2 f = (e * 2. - i.xy) / min(i.y, i.x);
  vec3 a, b, F = vec3(0, 0, -1), g = vec3(f * .5, 1);
  float q;
  a += v(f.y / 2. + .5);
  float d = 1e+10, k = 0., c = 0.;
  for (int r = 0; r < 64; r++)
    b = F + g * q, c = l(b), k = d < 3e-3 && c > d + 1e-3 && b.z > 0. ? 1. : k,
    q += c, d = c < d ? c : d;
  if (c < 1e-3) {
    float m = n(dot(j(b), vec3(.5, 1, -.5)));
    a = vec3(m) + D(reflect(j(b), normalize(b)) * .5), a = t(a);
    float G = u(b, vec3(.5, .8, -.1), .1, .2, 0) * m;
    a += (G + vec3(.02, .69, 1)) * .2, a += z(b, vec3(-.5, .6, .6), g, 6.),
        a = mix(a, vec3(.02, .69, 1), b.y / 2. + .5), a -= B(a) * .1,
        a += A(reflect(j(b), g)) * v(b.y / 2. + .5) * .2;
  }
  a = t(mix(a, vec3(1), k * (b.z / 2. + .5)));

  return vec4(a, 1);
}
void main() { gl_FragColor = E(gl_FragCoord.xy); }

