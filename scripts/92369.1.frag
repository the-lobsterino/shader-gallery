#extension GL_OES_standard_derivatives : enable

#ifdef GL_ES
precision lowp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{

  gl_FragColor = vec4(0.);
}