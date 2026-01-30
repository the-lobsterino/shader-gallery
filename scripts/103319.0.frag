#ifdef GL_ES
precision mediump float;
#endif

uniform float time;

void main() {
  float x = gl_FragCoord.x;
  float y = gl_FragCoord.y;
  float scale = 0.02;
  float speed = 10000.0;
  float displacement = sin(time * speed + (x + y) * scale) * 50.0;
  vec4 color = vec4(
    sin(x * scale + displacement),
    sin(y * scale + displacement),
    cos((x + y) * scale + displacement),
    1.0
  );
  gl_FragColor = color;
}
