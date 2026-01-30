#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p =2.0* ( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0); 

	float box_width = 0.3; 
	float box_height = 0.5; 
	float LT = 0.005; // line thickness
	if (abs(p.x) < box_width && abs(abs(p.y)-box_height+LT) <= LT) col = vec3(1); 
	if (abs(p.y) < box_height && abs(abs(p.x)-box_width+LT) <= LT) col = vec3(1); 
	gl_FragColor = vec4(col,1.0); 
}