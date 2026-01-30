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
	vec3 col = vec3(0); 
	
	
	if (mod(-0.5*time+abs(p.x+p.y)*5.0+abs(p.x-p.y)*5.0,1.0) < 0.2) col = vec3(1,0,0); 
	gl_FragColor = vec4(col, 1.0);

}