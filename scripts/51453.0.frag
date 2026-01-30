#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0; 
	
	vec3 col = vec3(0); 
	
	
	for (int i = 0; i < 16; i++) {
		
		
		col += vec3(1)*1.0/(1.0+20.0*abs(p.y+0.5*sin(p.x*4.0+time*float(i)*0.1+float(i)))); 
	}
	col /= 5.0;
	gl_FragColor = vec4(col, 1.0); 
}