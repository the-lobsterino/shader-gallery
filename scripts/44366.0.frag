#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 mouse;
uniform vec2 resolution;
uniform float time;


void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0);
	
	
	col = vec3(0.0,0.0,1.00)*sin(time*0.005+clamp(1.0/(50.0*abs(length(p.xy)-0.5)), 0.0, 1.0)*2.0);
	gl_FragColor = vec4(col, 1.0); 
}