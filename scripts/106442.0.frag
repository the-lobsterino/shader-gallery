#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D spectrum;
uniform sampler2D samples;
uniform float volume;
uniform sampler2D backbuffer;

float PI = 3.14159265359;
float PI2 = 1.57079632679;
float amp = .1;  // **** Adjust sensitivity　****
float w = 500.0; // **** Adjust　****

// Perlin Noise
// original https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
// form here
float rand(vec2 c) {
  return fract(sin(dot(c.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec2 p, float freq, float screenWidth) {
  float unit = screenWidth / freq;
  vec2 ij = floor(p / unit);
  vec2 xy = mod(p, unit) / unit;
  // xy = 3.*xy*xy-2.*xy*xy*xy;
  xy = .5 * (1. - cos(PI * xy));
  float a = rand((ij + vec2(0., 0.)));
  float b = rand((ij + vec2(1., 0.)));
  float c = rand((ij + vec2(0., 1.)));
  float d = rand((ij + vec2(1., 1.)));
  float x1 = mix(a, b, xy.x);
  float x2 = mix(c, d, xy.x);
  return mix(x1, x2, xy.y);
}

float pNoise(vec2 p, int res, float screenWidth) {
  float persistance = .5;
  float n = 0.;
  float normK = 0.;
  float f = 4.;
  float amp = 1.;
  int iCount = 0;
  for (int i = 0; i < 50; i++) {
    n += amp * noise(p, f, screenWidth);
    f *= 2.;
    normK += amp;
    amp *= persistance;
    if (iCount == res)
      break;
    iCount++;
  }
  float nf = n / normK;
  return nf * nf * nf * nf;
}
// to here

void main(void) {
  vec3 rColor = vec3(0.5, 0.0, 0.3);
  vec3 gColor = vec3(0.0, 0.5, 0.3);
  vec3 bColor = vec3(0.0, 0.3, 0.5);
  vec3 yColor = vec3(0.5, 0.5, 0.0);

  vec2 p = (gl_FragCoord.xy * 2.0 - resolution);
  p /= min(resolution.x, resolution.y);

  float t = time;
  float v = volume / 255.0;

  vec4 freq = vec4(0);
  freq.x = texture2D(spectrum, vec2(0.1, .5)).r * 2.0;
  freq.y = texture2D(spectrum, vec2(0.3, .5)).r * 3.0;
  freq.z = texture2D(spectrum, vec2(0.5, .5)).r * 8.0;
  freq.w = texture2D(spectrum, vec2(0.7, .5)).r * 10.0;
  freq *= amp;

  vec4 Ax = vec4(0);
  Ax.x = pNoise(vec2(t, freq.x), 2, w);
  Ax.y = pNoise(vec2(t, freq.y), 2, w);
  Ax.z = pNoise(vec2(t, freq.z), 2, w);
  Ax.w = pNoise(vec2(t, freq.w), 2, w);
  Ax *= PI2;
  Ax += PI * v;

  vec4 At = vec4(0);
  At.x = pNoise(vec2(t, freq.x), 9, w);
  At.y = pNoise(vec2(t, freq.y), 9, w);
  At.z = pNoise(vec2(t, freq.z), 9, w);
  At.w = pNoise(vec2(t, freq.w), 9, w);
  At *= PI2;
  At += v * .01;

  float Aa = 0.005 + .1 * pNoise(vec2(t, v), 2, resolution.x);

  vec4 a = sin(p.y * Ax - t * At) / (2.);
  vec4 b = Aa / abs(p.x + a);

  vec3 destColor = vec3(0);
  destColor += rColor * b.x;
  destColor += gColor * b.y;
  destColor += bColor * b.z;
  destColor += yColor * b.w;

  vec4 c = texture2D(backbuffer, gl_FragCoord.xy / resolution);
  gl_FragColor = vec4(destColor, 1.0) + c * 0.86;
}