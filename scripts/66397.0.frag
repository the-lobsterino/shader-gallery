#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool aproxequal(float x, float y) {
	return abs(x - y) < 0.001;
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	vec2 p = position;
	p.x *= 2.0;
	p.x -= 1.0;
	p.y *= 2.0 * resolution.y / resolution.x;
	p.y -= 1.0 * resolution.y / resolution.x;
	
	float x = p.x;
	float y = p.y;
	
	vec3 color = vec3(0.0,0.0,0.0);
	
	float t = time / 4.0;

	bool even = true;
	
	for (int i = 0; i <= 50; ++i) {
		float d = (0.01 + 0.02 * abs(sin(t / 20.0))) * float(i);
	
		float r = abs(sin(float(i) / 5.0 + t * 0.25));
		float g = abs(cos(float(i) / 12.0 + t * 0.5));
		float b = abs(sin(float(i) / 20.0 + 1.0 + t));
		

		if (even && aproxequal(max(abs(x),abs(y)), d)) {
			color = vec3(r,g,b);
		} else if (aproxequal(min(abs(x),abs(y)), d)) {
			color = vec3(r / 5.0);
		} 
		
		even = !even;
	
	}
	

	gl_FragColor = vec4(color, 1.0);

}