// P2

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// "[SH17A] Fireworks" by Martijn Steinrucken aka BigWings/Countfrolic - 2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Based on https://www.shadertoy.com/view/lscGRl

#define N(h) fract(sin(vec4(6,9,1,0)*h))

void main(void)
{
  vec4 o = vec4(0.0,0.0,1.0,0.0); 
  vec2 uv = gl_FragCoord.xy/resolution.y;
    
  float e, d, i=0.2;
  vec4 p;
    
  for(float i=1.0; i<9.9; i++) {
    d = floor(e = i*9.1+time);
    p = N(d)+.13;
    e -= d;
    for(float d=0.; d<15.;d++)
      o += p*(2.9-e)/1e3/length(uv-(p-e*(N(d*i)-.5)).xy);  
  }
	 
  gl_FragColor = vec4(o.rgb, 1);
}