#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
 
float rings(vec2 p)
{
  return cos(length(p)*64.0 - time * 10.0);
}
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 
  gl_FragColor = vec4(rings(pos));
}