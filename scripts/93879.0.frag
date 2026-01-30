#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(0);
	
	p.y = floor(p.y*123.0)/123.0;
	
	col = vec3(0.0) + vec3(1,0,0)*sin(p.x*3.0+p.y*3.0+2.0*time)*1.0;
	col += vec3(0.0) + vec3(0,1,0)*sin(p.x*-0.6+p.y*3.0+2.5*time+0.1)*1.0;
	col += vec3(0.0) + vec3(0,0,1)*sin(p.x*0.7+p.y*3.0+1.8*time+0.2)*1.0;
	col = floor(col*7.0)/7.0;
	
	gl_FragColor = vec4(col, 1.0);
}