precision mediump float;

uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_resolution;

void main(void) {
  vec2 pos = gl_FragCoord.xy * 0.01;
  vec3 color = vec3(abs(step(0.5, fract(pos.x)) - step(0.5, fract(pos.y))));

  gl_FragColor = vec4(color, 1.0);
}