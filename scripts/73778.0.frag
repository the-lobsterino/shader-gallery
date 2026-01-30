#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float battery;

void main(void) {
  float uv = gl_FragCoord.y / resolution.y;

  gl_FragColor = vec4(step(uv, test) * (1.0 - test), step(uv, test) * test, ( step(uv, test) * (1.0 - uv) ) * 0.5, 1.0);
}