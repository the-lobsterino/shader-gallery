#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p =2.0* ( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0);
	
	
	
	float ang = time;
	p = vec2(cos(ang)*p.x-sin(ang)*p.y,sin(ang)*p.x+cos(ang)*p.y); 
	p.x += 0.7;
	// P
	if (abs(p.x)  < 0.15 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x-0.05)  < 0.15 && abs(p.y-0.025) < 0.005) col =vec3(0);
	if (abs(p.x+0.05)  < 0.15 && abs(p.y+0.025) < 0.005) col =vec3(0);

	// A
	p.x -= 0.20;
	if (abs(p.x)  < 0.025 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x)  < 0.025 && abs(p.y-0.11) < 0.025) col =vec3(1);

	// O	
	p.x -= 0.20;
	if (abs(p.x)  < 0.15 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x)  < 0.10 && abs(p.y+0.05) < 0.075) col =vec3(0);

	// C
	p.x -= 0.33;
	if (abs(p.x)  < 0.15 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x-0.05)  < 0.15 && abs(p.y+0.00) < 0.025) col =vec3(0);

	// L	
	p.x -= 0.20;
	if (abs(p.x)  < 0.025 && abs(p.y-0.022) < 0.10) col =vec3(1);

	// A
	p.x -= 0.20;	
	if (abs(p.x)  < 0.15 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x+0.025)  < 0.13 && abs(p.y-0.025) < 0.005) col =vec3(0);
	if (abs(p.x+0.00)  < 0.105 && abs(p.y+0.025) < 0.005) col =vec3(0);

	// I
	p.x -= 0.20;
	if (abs(p.x)  < 0.025 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x)  < 0.025 && abs(p.y-0.11) < 0.025) col =vec3(1);

	// R
	p.x -= 0.20;
	if (abs(p.x)  < 0.15 && abs(p.y) < 0.075) col =vec3(1);
	if (abs(p.x-0.04)  < 0.14 && abs(p.y+0.05) < 0.075) col =vec3(0);


	gl_FragColor = vec4(col, 1.0);
}