#extension GL_OES_standard_derivatives : enable

precision highp float;





uniform vec2 resolution;
uniform float time;

void main() {
  vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
  uv.y *= -1.0;
  float x = uv.x * 0.5;
  float y = uv.y * 0.5;
  float t = mod(time, 10.0) / 10.0;
  float s = sin(t * 3.14159);
  float c = cos(t * 3.14159);
  float tx = x * c - y * s;
  float ty = x * s + y * c;
  float r = length(vec2(tx, ty));
  float m = (cos(r * 80.0) + 1.0) * 0.5;
  gl_FragColor = vec4(vec3(m), 1.0);
}