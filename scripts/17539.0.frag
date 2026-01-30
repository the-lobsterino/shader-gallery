#ifdef GL_ES
precision mediump float;
#endif
uniform vec2 resolution;
uniform float time;
void main(void){
  vec2 pos = mod(gl_FragCoord.xy, vec2(5.0+cos(gl_FragCoord.x/resolution.x*8.0+time)/2.0)) - vec2(0.0);
  float dist_squared = dot(pos, pos);
  vec4 circles = (dist_squared < 2.0) ? vec4(.0, .0, .0, 0.0): 
	                                vec4(1.0, 1.0, 1.0, 1.0);

  gl_FragColor = circles;
}