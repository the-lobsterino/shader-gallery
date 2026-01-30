// Have a nice day <3 0 <3

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0); 
	
	vec2 op = p;	
	// head
	if (length(p) < 0.5) col = vec3(1,0.75,0); 
	//  smile
	if (length(vec2(1,1)*(p-vec2(-0,-0.025))) < 0.32) col = vec3(0,0,0); 
	if (length(vec2(1,1)*(p-vec2(-0,+0.025))) < 0.32) col = vec3(1,0.75,0); 
	if (length(vec2(1,1)*(p-vec2(0.35+0.02,-0.025+0.00))) < 0.10) col = vec3(1,0.75,0); 
	if (length(vec2(1,1)*(p-vec2(-0.35-0.02,-0.025+0.00))) < 0.10) col = vec3(1,0.75,0); 
	// dimple
	p.x = abs(p.x); 
	p -= vec2(0.35,-0.01); 
	float ang = atan(p.y,p.x); 	
	if (ang > -2.8 && ang < -1.4 && abs(length(p)-0.1) < 0.005) col = vec3(0,0,0); 
	p = op; 
	// eyes
	if (length(vec2(2,1)*(p-vec2(0.15,0.15))) < 0.12) col = vec3(0,0,0); 
	if (length(vec2(2,1)*(p-vec2(-0.15,0.15))) < 0.12) col = vec3(0,0,0); 
	
	
	
	gl_FragColor =vec4(col, 1.0); 

}