#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 G (vec2 p,vec3 col){
	
	 col = vec3(0);
	
	

	p.y =1.2* sin(p.y);
	//if (abs(p.x) < 0.1 && abs(p.y) < 0.4) col = vec3(1);	// vbar
	//if (abs(p.x) < 0.4 && abs(p.y) < 0.1) col = vec3(1);	// hbar
	vec2 op = p; 
	p.x += 0.00;
	p.y -= 0.50;
	if (abs(p.x) < 0.4 && abs(p.y) < 0.1) col = vec3(1);	// hbar      ---
	p.y += 1.1;
	if (abs(p.x) < 0.4 && abs(p.y) < 0.1) col = vec3(1);	// hbar      ---
	 	
	p = op;
	p.x += 0.3;
	p.y += 0.1;
	if (abs(p.x) < 0.1 && abs(p.y) < 0.6) col = vec3(1);	// vbar     |
	p.x += -0.6;                                            //          |
	p.y += 0.2;
	if (abs(p.x) < 0.1 && abs(p.y) < 0.2) col = vec3(1);	// vbar        |
	
	 
	p.x += 0.10;
	p.y -= 0.30;
	if (abs(p.x) < 0.2 && abs(p.y) < 0.1) col = vec3(1);	// hbar       --
	
	
	return vec3(col);
}

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y;
	
	vec3 col= vec3 (0);
 	
	col = G (p,col);
	
	
	gl_FragColor = vec4(col.r*(0.8+p.x),col.g*0.4,0.0, 1.0); 
}