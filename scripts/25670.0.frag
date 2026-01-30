#ifdef GL_ES
precision mediump float;
#endif

// YOU'RE ABOUT
// TO HACK TIME,
// ARE YOU SURE? asdsad
//  >YES   NO

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

void glow(float d, float i, vec3 c) {
	
		
	gl_FragColor.rbg += c*2.00 / d;
}


void point(vec2 a, vec3 c) {
	a.x *= resolution.y/resolution.x;
	//a += 0.0;
	a *= resolution/1.0;

	vec2 P = gl_FragCoord.xy;
	float d = distance(P, a);
	glow(d, 1.0, c);
}

float rand(int seed) {
	return fract(sin(float(seed)*15.234234) + sin(float(seed)*4.3456342) * 372.4532);
}

 

void main( void ) {
	gl_FragColor = vec4(0.1, 0.1, 0.1, 1.0);
	
	// color 
	vec3 z = vec3(0.2, 0.7/2.0, 0.8/2.0);
	
	float y = 0.0;
	
	
	// Starfield
	for (int l=1; l<100; l++) {
		float sx = (fract(rand(l+342) + time * (0.02 + 0.1*rand(l)))-.5) * 4.0;
		float sy = y + 1.0 * rand(l+8324);
		point(vec2(sx,sy), z);
	}
}