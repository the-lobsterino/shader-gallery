// good old interference modded. By @dennishjorth
#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

float rings(vec2 pp, float time2)
{
  vec2 p = pp;
  p.x += cos(time2*0.2+pp.y*0.35+pp.x*0.1)*0.3;
  p.y += sin(time2*0.2+pp.x*0.35+pp.y*0.1)*0.3;
  return cos(length(p)*96.0 - time2 * 0.1);
}

void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
  vec2 pos2 = pos;
  pos2.x += cos(time*0.3)*0.3;
  pos2.y += sin(time*0.3)*0.3;
  gl_FragColor = vec4(rings(pos,time*2.1)*rings(pos2,time*3.15+1.2));
}