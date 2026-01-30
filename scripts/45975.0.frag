#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

// time line visualizer

vec3 drawTimeline(in vec2 p) 
{
	vec2 op = p; 
	vec3 col = vec3(0);

	if (abs(p.y) < 0.2 && abs(p.x -(2.0*mouse.x-1.0)) < 0.001) col += vec3(1.0);
	if (abs(p.y) < 0.001) col += vec3(0.5); 
	return col; 
}


void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0; 
	p.x *= resolution.x/resolution.y; 
	vec3 col = vec3(0); 
	
	
	col = drawTimeline(p); 
	
	for (int i = 0; i < 20; i++) { 
		if (abs(p.x) < 0.25 && abs(p.y) < 0.25 && (abs(p.x) > 0.245 || abs(p.y) > 0.245)) col += vec3(1)*(0.5+0.5*sin(time+0.2*float(i))); 
		p *= 0.93; 
		float ang = 0.08; 
		p = vec2(p.x*cos(ang)-p.y*sin(ang),p.x*sin(ang)+p.y*cos(ang)); 
	}
	gl_FragColor = vec4(col, 1.0); 
}