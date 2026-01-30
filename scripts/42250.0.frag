#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 
	
	float a = time * 0.5;
	mat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a));
	p = rot * p;
	
	vec3 col = vec3(0); 
	
	float v = fract(-1.5 * time + abs(p.x + p.y) * 5.0 + abs(p.x-p.y) * -5.0);
	float f = smoothstep(0.0, 0.7, v) - smoothstep(0.8, 0.9, v);
	
	f = f / (1. + length(p));
	
	//f = step(0.8, v);
	col = f * vec3(1,1,1); 
	gl_FragColor = vec4(col, 1.0);

}