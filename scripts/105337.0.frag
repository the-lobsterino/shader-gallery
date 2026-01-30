//          (__)
//          (oo) < F
//   /-------\/ 
//  / |     ||  
// *  ||----||  
//    ^^    ^^  

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	vec2 m = vec2(mouse * 2.0 -1.0);
	m.x *= resolution.x / resolution.y;
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	float t = sin(length(m - p) * 30.0 + time * 5.0);
	
	vec4 destcolor = vec4(0.0, 0.0, 0.0, 1.0);
	
	destcolor.rgb = vec3(t);
	
	gl_FragColor = destcolor;
}