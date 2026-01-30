#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float pi = 3.141592653589793;
void main() { 
  vec2 p = gl_FragCoord.xy / resolution;
  p = 2.0 * p - 1.0;
  p.x *= resolution.x / resolution.y;
  float a = atan(p.y, p.x) / pi * 0.5 + 0.5;
  float d = length(p + time);
  float col = sin(a * pi * 2.0 + cos(p.x * d * pi) * 4.0);
  col = smoothstep(0.0, 1.0, col);
  gl_FragColor = vec4(vec3(col), 1.0);
}