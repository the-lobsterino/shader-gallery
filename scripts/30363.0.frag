#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float easeInOutCubic(float pos) {
  float p = pos / 0.6;
  if (p < 1.) {
    return 0.5 * pow(abs(p), 3.);
  }
  return 1.-0.5 * pow(abs(p), 3.);
}

void main( void ) {

  vec2 position = gl_FragCoord.xy / resolution.xy;
   
  	
  float v = easeInOutCubic(position.x);
  gl_FragColor = vec4(v,0,0,1);

}