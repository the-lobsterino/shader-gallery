/*
 * "Interference" by Daker Fernandes - 2020
 * License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
 */

#ifdef GL_ES
precision highp float;
#endif


uniform float time;
uniform vec2 resolution;
#define WAVELENGTH 22.0
#define C 555.0
#define R_CENTER vec2(0, 0)
#define G_CENTER vec2(0, resolution.y/04.0)
#define B_CENTER vec2(0, resolution.y)

float wave(vec2 c, vec2 pos)
{	
  float d = distance(c, pos);
  return 1000000.0 * sin((d - time * C) / WAVELENGTH);
}

void main( void )
{
  vec2 pos = gl_FragCoord.xy;
  gl_FragColor = vec4(
	  wave(R_CENTER, pos),
 	  wave(G_CENTER, pos),
	  wave(B_CENTER, pos),
	  6.0);
}
