#extension GL_OES_standard_derivatives : enable


// Have an acid friday!!

precision mediump float;

uniform float time;

uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;

	p.x *= resolution.x/resolution.y;
	vec3 col =vec3(1);
	
	
        p += 0.1;
	p.y += 0.09*cos(p.x*21.0+time*3.0);
	p.x += 0.0*sin(p.y*2.0+time*20.0);
	
	
	if (length(p) < 1.1) col = vec3(0);
	if (length(p) < 1.00) col = vec3(1,1,0);
	
	if (length((p-vec2(0.4,0.2))*vec2(2,1)) < 0.25) col = vec3(1,0,2);
	if (length((p-vec2(-0.4,0.2))*vec2(2,1)) < 0.25) col = vec3(1,0,2);
	

	float ang = atan(p.y,p.x);
	float arc = length((p-vec2(0,+0.0))*vec2(1.0,1));
	if (p.y < 0.0 && abs(arc-0.8)<0.025) col = vec3(0,0,0);


	gl_FragColor = vec4(col, 1.0);
}