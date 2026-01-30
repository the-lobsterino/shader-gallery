// + Неопознанный . пятница 13 дек 2019

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
  vec2 st = 4.*(gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
  float dd = 0.0;
  vec3 col = 0.5*(1. + cos(time +st.xyx+vec3(0,2,4)));
  float a = atan(st.x,st.y)+3.14;
  float r = 6.28/float(2);   // количество граней 
  dd = cos(floor(.5+a/r)*r-a)*length(st);
  vec3 coltrian = vec3(1.0-smoothstep(.2,.21,dd))+vec3(dd);
  gl_FragColor = vec4(1.-coltrian + col ,1.0);
}