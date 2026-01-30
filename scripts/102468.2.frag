#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

void main( void ) {
  vec2 st = gl_FragCoord.xy / u_resolution.xy;
  st.x *= u_resolution.x / u_resolution.y;

  float time = u_time * 0.2;
  float speed = 1.0;
  float dist = distance(st, vec2(0.5)) * 2.0;
  float angle = atan(st.y - 0.5, st.x - 0.5) + time * speed;
  float scale = 1.5;
  float bars = (sin(angle * scale) + 1.0) / 2.0;
  float gradient = pow(bars, 5.0) * 1.3 + 0.2;

  vec3 color = mix(vec3(gradient), vec3(0.05, 0.05, 0.1), dist);

  gl_FragColor = vec4(color, 1.0);
}
