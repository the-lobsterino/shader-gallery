#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 p = 2.0*( gl_FragCoord.xy / resolution.xy )-1.0;
	p.x *= resolution.x/resolution.y;
	vec3 col = vec3(0);
	
	
	vec2 op = p;
	
	for (int w = 0; w < 8; w++) {
		p = op+0.001*vec2(cos(float(w)),sin(float(w)));
	for (int k = 0; k < 6; k++) {
		
		for (int j = 0; j < 2; j++) {
			for (int i = 0; i < 3; i++) {		
				if (abs(length(p.xy-vec2(i-1,float(j)-0.5))-0.3) < 0.003) col += vec3(1)/(1.0+0.5*float(k));
			}
		}
		p *= 1.0+mouse.x;
		//col *= 0.7;
	}
		col *= 0.5;
}
	gl_FragColor = vec4(col, 1.0);
}