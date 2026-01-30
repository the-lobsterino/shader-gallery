#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform vec2 resolution;
uniform float time;
uniform vec3 cameraPosition;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  float noise = abs(sin(uv.x * 10.0 + time * 2.0) * cos(uv.y * 10.0 + time * 2.0));
  vec3 color = vec3(noise, noise * 0.5, 0.0);
  gl_FragColor = vec4(color, 1.0);
}