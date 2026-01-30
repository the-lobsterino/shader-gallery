#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void )      // shorter version...
{
  vec2 position = (gl_FragCoord.xy / (resolution.xy)) * (2.+mouse.x) - 1.0;
  gl_FragColor = vec4(1. - clamp(pow(length(position), 6.0), 0., 1.));
}