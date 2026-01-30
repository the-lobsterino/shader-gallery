#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float plot(vec2 st, float pct) {
  return smoothstep(pct - 0.02, pct, st.y) -
	 smoothstep(pct, pct + 0.02, st.y);
}

void main( void ) {
  vec2  pos   = gl_FragCoord.xy / resolution;
  float line1 = plot(pos, pos.x);
  float line2 = plot(pos, 1.0 - pos.x);
  vec3  color = line1 * vec3(0.0, 1.0, 0.0);

  color = color + line2 * vec3(0.0, 0.0, 1.0);
	
  gl_FragColor = vec4(color, 1.0);
}