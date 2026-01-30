#extension GL_OES_standard_derivatives : enable

#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform float time;
uniform int pointerCount;
uniform vec3 pointers[10];
uniform vec2 resolution;

#define PI 3.14159
#define L 0.05
#define eps 0.3
#define t time

void main(void) {
  float mx = max(resolution.x, resolution.y);
  vec2 uv = gl_FragCoord.xy / mx;
  float col= 0.0;
  col += cos((uv.x*cos(3.6*t/7.0)+uv.y*sin(3.6)-3.5)
   * 2.0*PI/L);
col += cos((uv.x*cos(43.)+uv.y*sin(43.)+12.5)
   * 2.0*PI/L);
col += cos((uv.x*tan(8.34)+uv.y*sin(8.34)-65.5)
   * 2.0*PI/L);
//col = col/6.0 +0.5;
col /= 3.0;
//col = col*.5+.5;
col = smoothstep(.0, eps,abs(col))/eps*0.8  ;

  gl_FragColor = vec4(vec3(col), 1.0);
}
