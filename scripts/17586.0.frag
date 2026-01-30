/*
  Daily an hour GLSL sketch by @chimanaco 4/30

  References:
  http://wgld.org/d/glsl/g004.html
*/

#ifdef GL_ES
precision mediump float;
#endif

uniform vec2  resolution;
uniform float time;
uniform vec2 mouse;

void main( void ) {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
   
  float u = abs(sin( (atan(p.y, p.x) - length(p) * 90. * (sin(time) / 5.)  + 5. + time) * 10.0 * 0.5) * 0.5 * sin(time)) + 0.15;
  float t = 0.01 / abs(u / 1.6  - length(p));         
  gl_FragColor = vec4(vec3(t), 1.0);
}

