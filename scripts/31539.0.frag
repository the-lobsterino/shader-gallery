#ifdef GL_ES
precision highp float;
#endif
 
uniform vec2 resolution;
uniform float time;
 
void main(void)
{
  // Be Cool and
  vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
  p.x *= resolution.x/resolution.y;
  float a = atan(p.x, p.y);
  float r = length(p);
 
  float b = 1.9 * sin(8.0 * r - time - 2.0 * a);
  b = 0.3125 / r + cos(7.0 * a * b + b * a) / (100.0 * r);
  b *= smoothstep(0.0, 0.8, b);
 
  gl_FragColor = vec4(b, 0.67 * b + 0.1*b*sin(a + time) , r*b, 1.0);
}   