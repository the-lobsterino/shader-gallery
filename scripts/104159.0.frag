precision mediump float;

uniform vec2 u_start;
uniform vec2 u_end;
uniform vec3 u_color1;
uniform vec3 u_color2;

void main() {
  vec2 uv = gl_FragCoord.xy;
  float t = (uv.x - u_start.x) / (u_end.x - u_start.x);
  vec3 color = mix(u_color1, u_color2, t);
  gl_FragColor = vec4(color, 1.0);
}