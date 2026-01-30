#extension GL_OES_standard_derivatives : enable


// Have an acid-friday!

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;

	p.x *= resolution.x/resolution.y;
	vec3 col =vec3(1);
	
	
	p *= 1.3;
	p.y += tan(p.x*6.0+time*3.0)*sin(time*1000.0);
	p.x += tan(p.y*8.0+time*12.0)*sin(time*1000.);
	
	
	if (length(p) < 1.0) col = vec3(0);
	if (length(p) < 0.98) col = vec3(1,1,0);
	
	if (length((p-vec2(0.3,0.3))*vec2(3,1)) < 0.25) col = vec3(0,0,0);
	if (length((p-vec2(-0.3,0.3))*vec2(3,1)) < 0.25) col = vec3(0,0,0);
	

	float ang = atan(p.y,p.x);
	float arc = length((p-vec2(0,+0.0))*vec2(1.0,1));
	if (p.y < 0.0 && abs(arc-0.8)<0.025) col = vec3(0,0,0);


	gl_FragColor = vec4(col, 1.0);
}