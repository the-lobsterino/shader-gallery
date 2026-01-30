#ifdef GL_ES
precision highp float;
#endif
 
uniform vec2 resolution;
uniform float time;
 
void main(void)
{
  // Be Cool
  vec2 p = -1.0 + 2.0 * gl_FragCoord.xy / resolution.xy;
  
  float a = -0.05;
  float r = length(p);
 
  float b = 1.5 * cos ( -1. - 5.00 / r);
  b = pow(b, r);
  b *= smoothstep(0.0005, 0.002, 0.03*b);
 
  gl_FragColor = vec4(b, 0.7 * b, 0.0, 1.0);
}