#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy ) -1.0;
	vec3 col = vec3(0);
	
	p.x *= resolution.x/resolution.y;
	
	
	for (int i = 0; i < 10; i++) {
		if (abs(length(p.xy*vec2(4.0*sin(time*9.0+float(i)*0.1),4.1*sin(time*10.0+float(i)*0.1))) - 0.6) < 0.002) col = vec3(1);
	}
	gl_FragColor = vec4(col, 1.0);
}