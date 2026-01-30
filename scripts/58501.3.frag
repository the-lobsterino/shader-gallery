precision mediump float;
uniform float time;
uniform vec2 resolution;

void main(void) {
  vec2 r=resolution;
  vec2 a=r/min(r.x,r.y);
  vec2 p=(gl_FragCoord.xy/r.xy)*a;
  float c=p.y+sin(p.x*10.+(time/5.0+994.1)*cos(p.y*100.)*10.)*.5+.5;
  if(p.y<a.y*.05||p.y>a.y*.95||p.x<a.x*.05||p.x>a.x*.95)c=.0;
  gl_FragColor=vec4(vec3(c*.1,c*.5,c),1.);
}