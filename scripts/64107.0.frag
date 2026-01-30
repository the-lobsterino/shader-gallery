#ifdef GL_ES
precision mediump float;
#endif 

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// "[SH17A] Fireworks" by Martijn Steinrucken aka BigWings/Countfrolic - 2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Based on https://www.shadertoy.com/view/lscGRl

#define N(h) fract(sin( vec4(6.0,9.0,1.0,0.0) * h)) 

void main(void)
{
  vec4 o; 
  vec2 u = gl_FragCoord.xy/resolution.y;
    
  float e = 0.0;
  float d = 0.0;
  float i = 0.0;
	
  vec4 p;
    
  for(float i=1.0; i < 5.0; i++)
  {
    e = i * 9.1 + time;
	  
    d = floor(e);
	  
    p = N(d) + 0.3;
	  
    e -= d;
	  
    for(float d = 0.0; d < 30.0; d++)
    {
      o += p * (2.0 - e) / 500.0 / length(u - (p - e *(N(d * i) - 0.5)).xy);  
    }
  }
	
  gl_FragColor = vec4(o.rgb, 1);
}