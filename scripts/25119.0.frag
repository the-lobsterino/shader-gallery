#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.1415926535
void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x / resolution.y; 
	vec3 col = vec3(0,0,1); 
	
	float ang = atan(p.y,p.x);
	float dist = length(p);
	ang += 1.0/dist+time; 
	ang = mod(ang*10.0, PI); 
	if (abs(ang) < PI/2.0)
		col = vec3(1,1,0); 
	
	col *= dist; 
	gl_FragColor = vec4(mix(vec3(0.0), col, clamp(dist-0.1, 0.0, 1.0)), 1.0); 
	
}