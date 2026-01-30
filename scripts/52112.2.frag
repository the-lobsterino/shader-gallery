#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float map(float s, float a1, float a2, float b1, float b2) { 
  return ((s - a1) / (a2 - a1)) * (b2 - b1) + b1;
}

void main( void ) {

   gl_FragColor = vec4(vec3(map(10., 0., 255., 0., 1.)), 1.);

}