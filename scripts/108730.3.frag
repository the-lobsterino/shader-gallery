
//---------------------------------------------------------
// Shader:   Newton-3Fractal.glsl     4/2015
// tags:     newton6fractal, 2d, complex number, attractor
// link:     Newton-9fractal
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
vec2 cinv(in vec2 a)
{
  return vec2(a.x, -a.y) / dot(a, a);
}

vec2 cmul(in vec2 a, in vec2 b)
{
  float r, i;
  r = a.x*b.y - a.y*b.x;
  i = a.x*b.y + a.y*b.x;
  return vec2(r, i);
}

vec2 cdiv(in vec2 a, in vec2 b)
{
  return cmul(a, cinv(b));
}
//---------------------------------------------------------
void main( void ) 
{
  vec2 z = surfacePosition*2.0;

  for (int i = 0; i < ITER; i++)
  {
    vec2 z2 = cmul(z, z);
    z -= cdiv(cmul(z2, z) - 3.0*mouse.x, (1.0+mouse.y) * z2);
  }
  gl_FragColor = vec4(max(0.0, z.x), max(0.0, z.y), max(0.0, -z.y), 1.0);
}