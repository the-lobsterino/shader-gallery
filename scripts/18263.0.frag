/*
  Daily an hour GLSL sketch by @chimanaco 25/30

  References:
  http://www.demoscene.jp/?p=1147
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

float rings(vec2 p)
{
  vec2 p2 = mod(p * 10.0, 4.0 )-2.0;
  float time = time  + pow(length(p2), 2.);
  return sin(time * 0.9) * 0.5 + 0.5;
}

void main(void) {
  vec2 p = (gl_FragCoord.xy * 2. -resolution) / resolution.y;
  float r = rings(sin(p + cos(p.x + time) * 0.05));
  float g = rings(sin(p + cos(p.x + time) * 0.27));
  float b = rings(sin(p + cos(p.x + time) * 0.49));
  gl_FragColor = vec4(r, g, b, 1.);
}
