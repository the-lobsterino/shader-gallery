#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
 
float rings(vec2 p)
{
  return sin(pow(2.0, 13.0)*cos(p.x*sin(time/10.))*(cos(p.y * sin(time/10.0) )));
}
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
  
  float c = rings(pos);
  float r = c * sin (time/5.0 + 3.14/3.0);
  float g = c * cos (time/3.0);
  float b = c * ( 1.0 - cos(time/7.0));
  gl_FragColor = vec4(r, g, b , 1.0);
}