#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
 
float rings(vec2 p)
{
  return cos(length(p)*2.0);
}
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
  vec4 pix = vec4(rings(pos));
  float l = pix.x * time * (0.8 + time * 0.001);
  pix.x = tan(l);
  pix.y = tan(l+1.0);
  pix.z = tan(l+2.0);
  gl_FragColor = pix;
}