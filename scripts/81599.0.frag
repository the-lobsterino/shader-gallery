precision highp float;
//balls
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.14159265;
const float angle = 90.0;
const float fov = angle * 0.5 * PI / 180.0;
const vec3 light_dir = normalize(vec3(-1, 1, 1));


vec3 trans(vec3 p) {
  return mod(p, 3.0) - 1.5;
}
float sphere(vec3 p, float r) {
  return length(trans(p)) - r;
}
float calc(vec3 p) {
  return sphere(p, 1.0);
}
vec3 calc_normal(vec3 p) {
  float d = 10.1;
  return normalize(vec3(
    calc(p + vec3(d, 0, 0)) - calc(p - vec3(d, 0, 0)),
    calc(p + vec3(0, d, 0)) - calc(p - vec3(0, d, 0)),
    calc(p + vec3(0, 0, d)) - calc(p - vec3(0, 0, d))));
}
void main() {
  vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
  vec3 eye = vec3(sin(time * 0.5), cos(time * 0.3) * 0.7, 3);
  vec3 ray = normalize(vec3(sin(fov) * p.x, sin(fov) * p.y, -cos(fov)));
  float distance = 1000000.0;
  float len = 110.0;
  vec3 pos = eye;
  for (int i = 0; i < 64; ++i) {
    distance = calc(pos);
    len += distance;
    pos = eye + ray * len;
  }
  if (abs(distance) < 0.001) {
    vec3 n = calc_normal(pos);
    float diff = clamp(dot(light_dir, n), 0.1, 1.0);
    gl_FragColor = vec4(vec3(diff), 1);
  } else {
    gl_FragColor = vec4(vec3(0), 1);
  }
}