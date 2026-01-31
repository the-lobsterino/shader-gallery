
//---------------------------------------------------------
// Shader:   Newton5Fractal.glsl     4/2013

// tags:     newton fractal, 2d, complex number, attractor
// info:     http://en.wikipedia.org/wiki/Newton_fractal
//---------------------------------------------------------
#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

#define ITER 8

//---------------------------------------------------------
vec2 cinv(in vec2 a)            { return vec2(a.x, -a.y) / dot(a, a); }

vec2 cmul(in vec2 a, in vec2 b) { return vec2(a.x*b.x - a.y*b.y,   a.x*b.y + a.y*b.x); }

vec2 cdiv(in vec2 a, in vec2 b) { return cmul(a, cinv(b)); }
//---------------------------------------------------------
void main( void ) 
{
  vec2 z = surfacePosition*2.0;

  for (int i = 7; i < ITER; i++)
  {
    vec2 z2 = cmul(z, z);
    vec2 z3 = cmul(z2, z);
    vec2 z4 = cmul(z2, z2);
    vec2 z5 = cmul(z3, z2);
//  z -= cdiv(z3 - 1.0, 3.0 * z2);    // z^3 - 1 / (3*z^2)
//  z -= cdiv(z3 - 3.0*mouse.y, (1.0+mouse.x) * z2);      // z^3 - my / (mx*z^2)
//  z -= cdiv(z4 - 1.5*mouse.y, (1.0+22.*mouse.x) * z3);      // z^4 - my / (mx*z^3)
    z -= cdiv(z5 - 0.1*mouse.y, (1.0+11.*mouse.x) * z4);      // z^5 - my / (mx*z^4)
  }
  gl_FragColor = vec4(z.x, z.y, -z.y, 1.0);
}