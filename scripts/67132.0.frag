#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
  float color = 0.0;
  vec2 pixel = gl_FragCoord.xy / resolution.xy;
  vec2 mouse = mouse.xy / resolution.xy;
  float ratio = resolution.x / resolution.y;

  gl_FragColor = vec4(vec3(color), 1.0);
}