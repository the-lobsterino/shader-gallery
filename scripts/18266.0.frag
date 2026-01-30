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
  vec2 p2 = mod(p * 10.0, 4.0 )-0.5;
  float time = time  + pow(length(p2*0.5), 0.5);
  return tan(time * 0.6) * 1.5 + tan(time*1.5);
}

void main(void) {
  vec2 p = (gl_FragCoord.xy * 2. -resolution) / resolution.y;
  float r = rings(sin(p + sin(p.x + time) * 1.00));
  float g = rings(cos(p + cos(p.x + time) * 1.27));
  float b = rings(tan(p + cos(p.x + time + 3.14) / 1.49));
  gl_FragColor = vec4(r, g, b, 100.0);
}
