#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform sampler2D backbuffer;
 
void main() {
  vec2 pos = (gl_FragCoord.xy*2.0 -resolution) / resolution.y;
 
  float theta = time*3.0;
  vec2 ballPos = vec2(cos(theta), sin(theta))*0.5;
  vec2 texPos = vec2(gl_FragCoord.xy/resolution);
 
  if(distance(pos, ballPos) < 0.3)
  {
    gl_FragColor = vec4(1.0);
  }else
  {
    gl_FragColor = texture2D(backbuffer, texPos)*0.8;
  }
}