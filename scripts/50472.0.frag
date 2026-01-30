#ifdef GL_ES
precision mediump float;
#endif

// atari st desktop??

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 atarist(vec2 p, vec3 col){
	
	
	if (abs(p.x) < 0.8 && abs(p.y) < 0.8) col = vec3(0,1,0);
	if (abs(p.x-0.005*1.5) < 0.5 && abs(p.y+0.01*1.5) < 0.4) col = vec3(0,0,0); 
	if ((abs(p.x)-0.5) < 0.0025 && (abs(p.y)- 0.4) < 0.005) col = vec3(0,0,0); 
	if (abs(p.x) < 0.5 && abs(p.y) < 0.4) col = vec3(1,1,1); 
		
	return col;
}

void main( void ) {

	vec2 p =2.0* ( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(1.0);
	
	 col = atarist(p,col);
	
	gl_FragColor = vec4(col, 1.0); 
}  