#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy)-1.0; 
	p.x *= resolution.x/resolution.y; 
	
	vec3 col = vec3(0); 
	
	p*=0.25; 
	for (int i = 0; i <8; i++) {
		float ang = time*0.1; 
		p = vec2(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang)); 
		p = mod(p+1.00, 2.0)-1.0; 
		if (abs(p.x) < 0.5 && abs(p.y) < 0.5)
			col = vec3(1) - col;
		
		p *= mod(time*0.5,10.0); 
	}
	
	gl_FragColor = vec4(col, 1.0); 
}