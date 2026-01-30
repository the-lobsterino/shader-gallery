#ifdef GL_ES
precision mediump float;
#endif

// watch in double resolution --novalis

uniform float time;
uniform vec2 resolution;

void main(void) {
	vec2 p = gl_FragCoord.xy/resolution.xy*2.-1.;
	p.x = p.x*(resolution.x/resolution.y);
	p /= dot(p, p);
	p = vec2(atan(p.y,abs(p.x)), length(p));
 
	float t = time*.125;
	float c = cos(t);
	float s = sin(t);
	
	float a = 0.;
	mat2 rm = mat2(c, s, -s, c) * 1.5;
	for (int i=0; i<15; i++) {
		p = abs(p)-1.25;
		p *= rm;
 
		for (int j=0; j<5; j++) {
			a += .001/abs(p.y - p.x/float(j));
		}
	}
	
	gl_FragColor = vec4(vec3(a), 1);
}
