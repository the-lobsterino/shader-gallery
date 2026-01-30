#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
  vec2 p = (gl_FragCoord.xy - .5*resolution.xy) / resolution.y;
  float a1 = 11.*length(p) - time;
  float a2 = 13.*length(p) + time;
  vec2 d = normalize(p) * (vec2(cos(a1),sin(a1)) / vec2(sin(a2),cos(a1))) + 0.5*tan(a1 + a2);
  float t = d.x + d.y;
  gl_FragColor.rgb = vec3(1.*t,-1.*t,cos(time)+t);
}