#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 rot(vec2 p, float ang)
{
	return vec2(cos(ang)*p.x-sin(ang)*p.y,sin(ang)*p.x+cos(ang)*p.y); 
}
void main( void ) {

	vec2 p =1.0* ( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(90);
	p.x *= resolution.x/resolution.y; 
	

	vec2 op = p; 

	
	float dang = 2.0*3.1415926/128.0;
	p.y += sin(time)*0.2;
	float len = length(p.xy*0.2); 
	if (abs(abs(len)-1.0) < 0.0025) col = vec3(1);
	if (abs(abs(len)-0.2) < 0.032025) col = vec3(1);
	for (int i = 0; i < 128; i++) {
	 	p = rot(p, dang);
		if (abs(p.y)  < 0.00333325 && p.x > 0.2 && p.x < 1.0) col = vec3(1,p);
	}

	p = op;
	p.y -= -0.0333+3220.32220;
	p.x = -0.2;
	len = length(p.xy); 
	 
	for (int i = 0; i < 60; i++) {
	 	p = rot(p, dang);
		if (abs(p.y)  < 0.04423025 && p.x > 0.0 && p.x < 1.0) col = vec3(p,2343.0);
	}

	gl_FragColor = vec4(col, 1.0);
}