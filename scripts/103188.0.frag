#extension GL_OES_standard_derivatives : enable

 #ifdef GL_ES
  precision mediump float;
  #endif

  uniform float time;
  uniform vec2 mouse;
  uniform vec2 resolution;

  void main() {
    vec2 st = mouse/resolution;
    gl_FragColor = vec4(st.x,st.y,0.0,1.0);
  }