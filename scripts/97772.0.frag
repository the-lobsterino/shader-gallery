precision mediump float;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main(void) {
  vec2 st = gl_FragCoord.xy *0.01;
  float angle =mouse.x;
  mat2 rot = mat2(cos(angle), -sin(angle),sin(angle), cos(angle));
  st = rot * st;
	
  vec3 color=vec3(abs(step(0.5,fract(st.x))-step(0.5,fract(st.y))),0.1,1);	
  gl_FragColor = vec4(color, 1.0);
}