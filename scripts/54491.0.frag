#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;

void main() {
  vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);

  float v = 0.0;
  for (int i = 0; i < 80; i++) 
  {
    float s = time + float(i) * 0.0075;
    vec2 mpos = 0.8 * vec2(sin(s * 5.0), - cos(s * 6.0));
    float t = 0.01 / length(mpos - pos);
    v += pow(t, 2.0);
  }

  gl_FragColor = 1.0 * vec4(vec3(v), 1.0);
}

