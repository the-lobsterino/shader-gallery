precision mediump float;
uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;
const float complexity      = 30.0;
const float mouse_factor    = 40.0;
const float mouse_offset    = 5.0;
const float fluid_speed     = 45.0;
const float color_intensity = 0.4;
void main() {
  vec2 p = (2.0 * gl_FragCoord.xy - resolution) / max(resolution.x, resolution.y);
  for (float i = 1.0; i < complexity; i++) {
    p.x += 0.6 / i * sin(i * p.y + time / fluid_speed + 0.3 * i) + mouse.y / mouse_factor + mouse_offset;
    p.y += 0.6 / i * sin(i * p.x + time / fluid_speed + 0.3 * i + 10.0) - mouse.x / mouse_factor + mouse_offset;
  }
  gl_FragColor = vec4(vec3(color_intensity * sin(0.1 * p.x) + color_intensity, color_intensity * sin(0.5 * p.y) + color_intensity, sin(p.x + p.y)), 0.4);
}