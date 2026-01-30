#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0,0,0); 
	
	float ang = atan(p.y,p.x);
	float dist = length(p);
	ang += floor(1.0*(10.0/dist+4.0*time))/10.0; 
	ang = mod(ang*1.0, PI); 
	if (abs(ang) < PI/2.0) {
		if (abs(mod(10.0/dist+1.0*time,1.0)) < 0.5) 
			col = vec3(0.2,0,0); 
		else
			col = vec3(0,0,0.6); 
	}
	else {
		if (abs(mod(10.0/dist+4.0*time,1.0)) > 0.5) 
			col = vec3(0,0.6,0); 
		else
			col = vec3(0,0.3,0.5); 
	}
	
	col *= dist; 
	gl_FragColor = vec4(col, 1.0); 
	
}