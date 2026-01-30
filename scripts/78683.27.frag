#extension GL_OES_standard_derivatives : enable


// HIDROGEN  - ENGINE
//
// Hello, from Ukraine
//

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;



vec3 color = vec3(0.0);

void main( void ) {


	
  gl_FragColor = vec4(color, 1.0);
}