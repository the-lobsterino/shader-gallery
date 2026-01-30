#extension GL_OES_standard_derivatives : enable


// Have a bad friday please!!

precision mediump float;

uniform float mouse;
uniform vec2 resolution;
uniform vec2 time;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;

	p.x *= resolution.x/resolution.y;
	vec3 col =vec3(1);
	
	

	
	
	if (length(p) < 1.0) col = vec3(0);
	if (length(p) < 0.98) col = vec3(1,1,0);
	
	if (length((p-vec2(0.3,0.3))*vec2(3,1)) < 0.25) col = vec3(0,0,0);
	if (length((p-vec2(-0.3,0.3))*vec2(3,1)) < 0.25) col = vec3(0,0,0);
	

	float ang = atan(p.y,p.x);
	float arc = length((p-vec2(0,+0.0))*vec2(1.0,1));
	if (p.y < 0.0 && abs(arc-0.8)<0.025) col = vec3(0,0,0);


	gl_FragColor = vec4(col, 1.0);
}