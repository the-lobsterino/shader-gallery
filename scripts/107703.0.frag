precision mediump float;

uniform float time;
uniform vec2 resolution;

void main(void) {
  vec2 position = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);

  vec3 a = vec3(0.0);
  float s = (sin(gl_FragCoord.x * 0.003 + time * 2.0) + 1.0) / 2.0;
  s = s * (cos(time * 3.0) + 1.0) / 2.0;
  if (gl_FragCoord.y / resolution.y > s)
    a = vec3(1.0);

  gl_FragColor = vec4(a, 1.0);
}