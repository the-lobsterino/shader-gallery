#ifdef GL_ES
precision mediump float;
#endif

#define T time
#define M mouse
#define R resolution
#define PI 3.14159265359

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
  vec2 pos = (gl_FragCoord.xy - 0.5*R) / R.y; // resolution-independent position relative to screen center
  //pos *= mat2(cos(T),sin(T),-sin(T),cos(T)); // rotate position around screen center

  float x = 50.0*pos.x, y = 50.0*pos.y, t = 10.0*time; // set spacetime parameters
  float u = sin(x + sin(y+t)), v = sin(y + sin(x+t)); // generate 2 orthogonal moving waves
  float r = u, g = u*v, b = v; // map waves on RGB components
  gl_FragColor = vec4(r, g, b, 1.0); // set fragment color
}