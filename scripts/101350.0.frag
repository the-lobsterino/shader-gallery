#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;

uniform sampler2D u_tex0; // texture unit 0

void main() {
  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  vec4 color = texture2D(u_tex0, st);
  gl_FragColor = color;
}
