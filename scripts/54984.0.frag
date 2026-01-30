#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

// "[SH17A] Fireworks" by Martijn Steinrucken aka BigWings/Countfrolic - 2017
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.
// Based on https://www.shadertoy.com/view/lscGRl

//#define N(h) fract(sin(vec4(6,9,1,0)*h) * 9e2)

#define MOD3 vec3(.1031,.11369,.13787)

vec3 hash(float p)
{
  vec3 p3 = fract(vec3(p) * MOD3);
	
  p3 += dot(p3, p3.yzx + 19.19);
	
  return fract(vec3((p3.x + p3.y) * p3.z, (p3.x + p3.z) * p3.y, (p3.y + p3.z) * p3.x));
}

vec3 Fireworks(vec2 uv, float t)
{
  vec3 colour = vec3(0.0);
	
  float ee = 0.0;
  float dd = 0.0;
	
  for (float firework = 1.0; firework < 7.0; firework++)
  {
    dd = floor(ee = firework * 9.1 + t);
	  
    vec3 fireworkColour = hash(dd);
	  
    ee -= dd;
	  
    for (float pixel = 1.0; pixel < 30.0; pixel++)
    {
      colour += fireworkColour * (1.0 - ee) / 1e3 / length(uv - (fireworkColour - ee * (hash(pixel * firework) - 0.5)).xy);
    }
  }
	
  return colour;
}

void main(void)
{
  vec2 uv = gl_FragCoord.xy / resolution.y;
	
  vec3 colour = Fireworks(uv, time);

  gl_FragColor = vec4(colour, 1);
}