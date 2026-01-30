#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable
uniform vec2 resolution;

void main() {
	vec2 position = gl_FragCoord.xy/resolution.xy;
	vec3 color = vec3(0.0);
	
	float left = step(0.2, position.x);
	float bottom = step(0.2, position.y); 
	
	color = vec3(left * bottom);
	gl_FragColor = vec4(color, 1.0);
	
}