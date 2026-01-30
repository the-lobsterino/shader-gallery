#version 300 es
precision highp float;
out vec4 FragColor;
uniform vec2 resolution;
void main() {
  vec2 st = gl_FragCoord.xy / resolution.xy;
  gl_FragColor = vec4(st.x, 0, 1, 0);
	
	#vec2 pos = ( gl_FragCoord.xy / resolution.xy );
	#float col = abs( 0.05 / (pos.x-0.5));
	#gl_FragColor = vec4(col, 0.0,0.0,1.0);	
}