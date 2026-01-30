//https://www.cnblogs.com/webgl-angela/p/9846990.html

#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash (float x)
{
  return fract (sin (x * 133.3 ) * 13.13 );
}

void main(void)
{
  vec2 resolution = vec2(500.0);

  vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  vec3 c = vec3(0.6, 0.7, 0.8);

  float a = 0.5;
  
  float si = sin(a);

  float co = cos(a);

  uv *= mat2(co, -si, si, co);
  
  uv *= length(uv + vec2(0.0, 4.9)) * 0.3 + 1.0;

  float v = 1.0 - sin(hash(floor(uv.x * 100.0)) * 2.0);

  float b = clamp(abs(sin(20.0 * time *.75 * v + uv.y * (5.0 / (2.0 + v)))) - 0.95, 0.0, 1.0) * 20.0;

  c *= v * b;

  gl_FragColor = vec4(c, 1.0);
}