#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const vec3 blue = vec3(0.24705882352941178,0.29019607843137257,0.63247863247863245);
const vec3 red = vec3(0.96470588235294119,0.31372549019607843,0.34509803921568627);

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0; 
	p.x *= resolution.x/resolution.y; 
	vec3 col = red; 
	
	if (abs(p.y) < 0.25) col = vec3(1,1,1);
	if (abs(p.x+0.75) < 0.25) col = vec3(1,1,1);
	
	if (abs(p.y) < 0.125) col = blue;
	if (abs(p.x+0.75) < 0.125) col = blue;
	
	gl_FragColor = vec4(col, 1.0); 
}