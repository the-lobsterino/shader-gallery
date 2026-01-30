// chatGPT a new thief of code !!!
#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

 
void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  vec2 pos = vec2(0.5);
  st -= pos;
  st.x *= resolution.x / resolution.y;
  float a = atan(st.x, st.y);
  float r1 = length(st) * 3.0;
  float r2 =  sin(a * 10.0 + time * 5.5) * 0.5 + 0.5;
  float r3 =  sin(a * 10.0 - time * 1.2) * 0.5 + 0.5;
  float d = abs(r1 - ( r3*r2 ));
  d = smoothstep(0.2, 0.0, d);
  
  gl_FragColor = vec4(vec3(d), 1.0);
}