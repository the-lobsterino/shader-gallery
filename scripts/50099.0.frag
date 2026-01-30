#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.14159265;

float circle(vec2 coord, vec2 center, float r, float aperture)
{
  float x = coord.x - center.x, y = coord.y - center.y;
  return sqrt(x * x + y * y - r * r) / (r * aperture);
}

void main( void )
{
  float aperture = (sin(time) + 1.0) / 50.0 + .025;
  float radius = min(resolution.x, resolution.y) / 4.0;
  vec2 center = resolution.xy / 2.0;
  
  gl_FragColor = circle(gl_FragCoord.xy, center, radius, aperture) * vec4(.1);
}