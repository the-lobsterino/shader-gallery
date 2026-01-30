#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 resolution;

vec2 VoroPoint(vec2 p) {
	vec3 a = fract(p.xyx*vec3(155.3, 212.3, 358.3));
	a += dot(a, a+2.45);
	return fract(vec2(a.x*a.x, a.y*a.z));
}

void main( void ) {

	vec2 pos = ( gl_FragCoord.xy / resolution.xy *2.5) - 1.25;
	vec3 col = vec3(0.0);
	
	float r_component = 0.1;
	float b_component = 0.1;
	float min_dist = 1.10;
	
	for (float k = 0.0; k <3.0; k++) {
		for (float i = 0.0; i<100.0; i++) {
			vec2 components = VoroPoint(vec2(i * 0.005));
			
			vec2 p = sin(components * time);
			float l = length(pos - p);
			
			if (l < min_dist) {
				min_dist = l;
			}
			b_component = min_dist;
			r_component = min_dist + b_component;
		}
		col += vec3(r_component * 0.5, 0.00, b_component * 0.4);
	}
	
	gl_FragColor = vec4( col, 3.0 );

}