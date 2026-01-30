#ifdef GL_ES
precision mediump float;
#endif

void main() {
  float x = gl_FragCoord.x - 256.0;
  float y = gl_FragCoord.y - 32.0;
  
  float rect_st = step(0.0, x) * step(0.0, y) * step(x, 256.0) * step(y, 256.0);
  
  vec4 rect_color = vec4(0.9, 0.1, 0.0, 1.0);
  vec4 bg_color = vec4(0.0, 0.1, 0.9, 1.0);
  
  gl_FragColor = mix(bg_color, rect_color, rect_st);
}
