#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 red = vec3(0.91,0.1,0.1);
const vec3 yellow = vec3(0.95,0.95,0.91);
const vec3 green = vec3(0.,0.95,0.);


void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0; 
	p.x *= resolution.x/resolution.y; 
	
	p.x += sin(p.y+time*2.0)*.05;
	p.y += sin(p.x*2.0-time*2.0)*.2;
	
	vec3 col = red; 
	
	
	if (abs(p.y) < 0.3) col = yellow;
	if (p.y < -0.3) col = green;
	//if (abs(p.x+0.75) < 0.2) col = yellow;
	
	if(abs(p.x) > 1.60) col = vec3(0.0);
	if(abs(p.y) > 1.0) col = vec3(0.0);
	
	gl_FragColor = vec4(col, 1.0); 
}