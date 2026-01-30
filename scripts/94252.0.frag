#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;

	vec3 col = vec3(0);
	
	
	for (int i = 0; i < 100; i++) {
		float r = float(i)*0.01;
		col += vec3(1.0)/(1.0+2500.0*(abs(length(sin(p.x*3237.0+p.y*23432.0)*0.050+p.xy-vec2(0,sin(-time+float(i)*0.03)*float(i)*0.008))-r))); 
		
	}
	gl_FragColor = vec4(col, 1.0);
}