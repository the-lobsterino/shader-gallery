/*
  Daily an hour GLSL sketch by @chimanaco 13/30

  Forked:
  http://glsl.heroku.com/e#7138.0
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415927
#define PI2 (PI * 2.0)

void main( void ) {
  vec2 position = (gl_FragCoord.xy * 2. -resolution) / resolution.y;
  vec2 p = position * 1000.*mouse.y;
  float r = length(p);
  float a = atan(p.y, p.x) + PI*2.*mouse.x;
  float d = r - a + PI2;
  float n = PI2 * float(int(d / PI2));
  float da = a + n;
  float pos = 0.07 *1.* da * da ;   
  float rand = sin(floor(pos));

  gl_FragColor = vec4(fract(rand *vec3(10.0, 1000.0, 100.0)), 1.0);
}