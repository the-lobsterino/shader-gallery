#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
 
void main(void)
{
  vec2 uv = 2.0 * (gl_FragCoord.xy / resolution.xy) - 1.0;
  float col=0.0;
  float freq=30.0;
  float displacement = 0.0;
  float micro_wave_af= 10.*cos(time*5.0 + 5.0*abs(cos(time*0.2)) + 10.*uv.x);
  
  float m_f = sin(time + micro_wave_af);
  // TOTO DOLE JE LEN NA KRESLENIE SI NEVSIMAJ
  float s_x =  abs(uv.x);
  float s_y =  abs(uv.y);
  float suradnice = 300.0 * s_x * s_y; 
  col = clamp(1.0 - 5.0*abs(0.5*m_f  - 40.0*uv.y), 0.0, 1.0);
  gl_FragColor = vec4(col, col, col, 1.0);
}