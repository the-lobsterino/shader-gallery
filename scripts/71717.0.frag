#ifdef GL_ES
precision mediump float;
#endif

#define T time
#define M mouse
#define R resolution

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
  vec2 pos = gl_FragCoord.xy / R.y; // resolution-independent position relative to lower-left screen corner
  //vec2 pos = (gl_FragCoord.xy - 0.5*R) / R.y; // resolution-independent position relative to screen center
  //vec2 pos = (gl_FragCoord.xy - M*R) / R.y; // resolution-independent position relative to mouse position
  //vec2 pos = (gl_FragCoord.xy - 0.5*R) / R.y + vec2(0.6*cos(T),0.3*sin(2.0*T)); // resolution-independent position relative to moving center

  float freq = 16.0; vec2 tile = floor(pos * freq + 0.5); // convert position into tile coordinates

  vec3 rgb = vec3(mod(tile.x + tile.y, 2.0)); // black-and-white chessboard
  //float steps = 5.0; vec3 rgb = vec3(mod(tile.x + tile.y, steps) / (steps - 1.0)); // multi-gray chessboard
  //vec3 rgb = vec3(mod(tile.x, 2.0), mod(tile.y, 3.0), mod(tile.x + tile.y, 2.0)); // multi-color chessboard
  //vec3 rgb = vec3(1.0 - max(abs(tile.x), abs(tile.y)) / freq); // concentric squares
  //vec3 rgb = vec3(max(abs(tile.x),abs(tile.y))); // single black tile

  //gl_FragColor = vec4(rgb, 1.0); // set fragment color
}