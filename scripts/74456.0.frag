#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0);
	
	
	
	col = vec3(1,0,0)*exp(-pow(length(p*vec2(0.0,1.5)-vec2(0.0,-0.5)), 2.0)); 
	col += vec3(0,1,0)*exp(-pow(length(p*vec2(0.0,1.5)-vec2(0.0,0.0)), 2.0)); 
	col += vec3(0,0,1)*exp(-pow(length(p*vec2(0.0,1.5)-vec2(0.0,+0.5)), 2.0)); 
	gl_FragColor = vec4(col, 1.0);	
}