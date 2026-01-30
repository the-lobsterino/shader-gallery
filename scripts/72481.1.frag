#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;

void main(void) {
  vec2 p = (gl_FragCoord.xy - 0.5*resolution.xy) / resolution.y;
  float a = 2.0 * sin(0.25*time) * (1.0 + 0.5 * sin(2.0*length(p)));  
  p *= 25.0*mat2(cos(a),-sin(a),sin(a),cos(a));
  vec2 c = floor(p); float d = 1.0;
  for (int i = -2; i < 3; i++)
    for (int j = -2; j < 3; j++) {
      vec2 r = c + vec2(i, j);
      float s = 1.0 + 0.1 * sin(5.0*time - 0.25*length(r));
      d = min(d, length(p - s*r));
    }
  float w = smoothstep(0.5, 0.4, d);
  gl_FragColor = vec4(w, w, w, 1.0);
}