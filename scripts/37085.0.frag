#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) 
{
  vec2 p = (gl_FragCoord.xy*2.0-resolution) / min(resolution.x, resolution.y);
  float l = 0.1/length(p);
  vec3 sky = vec3(0.1, 0.4, 1.0);
  vec3 sun = vec3(1.0, 1.0, 1.0);
  gl_FragColor = vec4(mix(sky,sun,l), 1.0);
}