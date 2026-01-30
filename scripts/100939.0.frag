#ifdef GL_ES
precision mediump float;
#endif
#extension GL_OES_standard_derivatives : enable 
uniform float time;
uniform vec2 u_resolution;

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 ripple = vec2(uv.x + sin(time + uv.y*5.0)*0.1, uv.y + sin(time + uv.x*5.0)*0.1);
  float n = sin(ripple.x*10.0 + time)*0.5 + 0.5;
  gl_FragColor = vec4(n*vec3(0.2, 0.4, 0.6), 1.0);
}
