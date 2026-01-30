#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void tri(){
	
	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0); 
	
	float t = mod(time*3.0,4.0); 
	
	p.x += 0.38; 
	if (abs(-p.x+p.y*0.5) < 0.035 && abs(p.y) < 0.3) col = vec3(1,p.x,0)*clamp(t,0.0,1.0);
	p.x += -0.295; 
	if (abs(p.x+p.y*0.5) < 0.035 && abs(p.y) < 0.3) col = vec3(0,0,2)*clamp(t-1.0,0.0,1.0);
	p.x += -0.30; 
	if (abs((p.x+0.445)) < 0.34 && abs(p.y+0.32) < 0.02) col = vec3(1,1,2)*clamp(t-2.0,0.0,1.0);
	gl_FragColor = vec4(col, 1.0);
}


void main( void ) {

 
	tri();
	 
	
	 
	 
}