#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) - 1.0; 
	vec2 op = p; 
	vec3 col = vec3(0,0,0); 
	vec3 tcol = vec3(0,0,0); 
	for (int j = 0; j < 20; j++) {
		float fj = float(j)*12.0; 
		p = op; 
		p.x += sin(time*0.5+fj*0.01+p.y*1.0)*0.3;
		p.x *= 1.0+sin(time*0.4+fj*0.02+p.y*0.8)*0.5; 
		p.x = mod(p.x+1.0, 2.0) - 1.0; 
	
		if (p.x > -1.0 && p.x <= -0.8) col = vec3(0,0,1); 
		if (p.x > -0.8 && p.x <= -0.6) col = vec3(0.8,0,0); 
		if (p.x > -0.6 && p.x <= -0.4) col = vec3(0,0.5,0); 
		if (p.x > -0.4 && p.x <= -0.2) col = vec3(1,0,1); 
		if (p.x > -0.2 && p.x <= -0.0) col = vec3(0,0.5,1); 
		if (p.x > -0.0 && p.x <= +0.2) col = vec3(1,0.5,1); 
		if (p.x > +0.2 && p.x <= +0.4) col = vec3(1,0.5,0); 
		if (p.x > +0.4 && p.x <= +0.6) col = vec3(1,0,1); 
		if (p.x > +0.6 && p.x <= +0.8) col = vec3(0,0.5,0); 
		if (p.x > +0.8 && p.x <= +1.0) col = vec3(0,0,0.5); 
	
		tcol += col*0.05; 
	}
	gl_FragColor = vec4(tcol, 1.0); 
}