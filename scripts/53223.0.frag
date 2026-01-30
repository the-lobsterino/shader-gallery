#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 F (vec2 p,vec3 col){
	
	 col = vec3(0);
	
	

	p.y = sin(p.y);
	//if (abs(p.x) < 0.1 && abs(p.y) < 0.4) col = vec3(1);	// vbar
	//if (abs(p.x) < 0.4 && abs(p.y) < 0.1) col = vec3(1);	// hbar
	vec2 op = p; 
	p.x += 0.0;
	p.y -= 0.50;
	if (abs(p.x) < 0.5 && abs(p.y) < 0.1) col = vec3(1);	// hbar
	p.y += 0.5;
	if (abs(p.x) < 0.3 && abs(p.y) < 0.1) col = vec3(1);	// hbar
	 	
	p = op;
	p.x += 0.4;
	p.y += 0.1;
	if (abs(p.x) < 0.1 && abs(p.y) < 0.5) col = vec3(1);	// vbar
	 
	return vec3(col);
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y;
	
	vec3 col= vec3 (0);
 	
	col = F (p,col);
	
	
	gl_FragColor = vec4(col.r*0.6,col.g*0.8,0.0, 1.0); 
}