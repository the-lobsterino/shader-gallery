#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
  vec2 p = gl_FragCoord.xy;
  float r = length(p - vec2(sin(time * 5.) * 100. + 200., sin(time * 3.3) * 100. + 200.));
  gl_FragColor = (r < 10.0) ? vec4(1., 0., 0., 0.) : (r < 11.0) ? vec4(11. - r, 0., 0., 0.) : vec4(0., 0., 0., 0.);
}
