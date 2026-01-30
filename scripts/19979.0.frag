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
 
	float t = time*.01;
	float c = cos(t);
	float s = sin(t);
	
	float a = 0.;
	mat2 rm = mat2(c, s, -s, c) * 1.5;
	for (int i=0; i<8; i++) {
		p = vec2(pow(abs(p.x)+1.3, 1.0), pow(abs(p.y)+1.3, 1.0))*rm;
 
		for (int j=0; j<64; j++) {
			a += 0.01/abs(p.y/sin(p.y+time) - p.x/sin(float(j)+p.x-time));
		}
		if(a > 1.) break;
	}
	
	gl_FragColor = vec4(vec3(a, 1. -a, .8), 1);
}
