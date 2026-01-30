precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define linearstep(edge0, edge1, x) min(max((x - edge0) / (edge1 - edge0), 0.0), 1.0)

void main(void) {
  vec2 st = gl_FragCoord.xy / resolution;
  vec3 c = vec3(linearstep(0.0, 1., abs(fract(st.y*10.)*2.-1.0)));
	float t = mod(time,8.0);
	
	if(t>1.0) {  gl_FragColor = vec4(c, 1.0);}
	if(t>2.0) {  gl_FragColor = vec4(c.r,0.0,0.0, 1.0);}
	if(t>3.0) {  gl_FragColor = vec4(c.r,c.g,0.0, 1.0);}
	if(t>4.0) {  gl_FragColor = vec4(0.0,0.0,c.b, 1.0);}
	if(t>5.0) {  gl_FragColor = vec4(0.0,c.g,c.b, 1.0);}
	if(t>6.0) {  gl_FragColor = vec4(0.0,c.g,0.0, 1.0);}
	if(t>7.0) {  gl_FragColor = vec4(c.r,0.0,c.b, 1.0);}
	 
}