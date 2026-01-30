#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define MAX_ITER 4
void main( void )
{
  gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}