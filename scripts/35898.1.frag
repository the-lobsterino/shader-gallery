#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

// HexagonalPattern by I.G.P.

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = atan(0.0,-1.0);

float hexagonalTiles(vec2 pos, float hexaGridSize)
{
  pos *= (0.283 / hexaGridSize);
  pos.x *= sqrt(3.0) / 3.0;
  float k = 44.*(cos(pos.y)*cos(pos.x) + cos(pos.x)*cos(pos.x) - sin(PI*1.5) - 1.0); 
  k = clamp (k, 0.0, 1.0);
  return k;
}

void main( void )
{
  vec2 pos = 2.0*(gl_FragCoord.xy / resolution.xy)-1.0;
  pos.x *= resolution.x/resolution.y;
  float k = hexagonalTiles(6.0*pos, 0.1);
  vec3 color = vec3(1.0, 1.0, 1.0);
  gl_FragColor = vec4(k*color, 1.0 );
}