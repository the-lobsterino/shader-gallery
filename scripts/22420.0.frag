#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse; 
uniform vec2 resolution;

/*
#define PI 3.14159
float toPolar(vec2 p) {
	float a = atan(p.y/p.x);
	if (p.x < 0.0) a += PI;
	return a;
}
float toPolar(vec2 p) {
	float r = length(p);
	if (r + p.x == 0.) return PI;
	float a = 2. * atan(p.y/(r + p.x));
	return a + PI; // range [0, 2*PI]
}*/
float rand(int seed, float ray) {
	return mod(sin(float(seed)*363.5346+ray*674.2454)*6743.4365, 1.0);
}

void main( void ) {
	float pi = 3.14159265359;
	float t = abs(sin(time));
	vec2 position = ( (gl_FragCoord.xy) / resolution.xy ) - mouse;
	position.y *= resolution.y/resolution.x;
	float ang = atan(position.x, position.y);
	float dist = length(position);
	gl_FragColor.rgb = vec3(1.2 * t, 1.5 * t, 1.9 * t) * (pow(dist, -0.8) * 0.009);
	for (float ray = 0.5; ray < 0.0; ray += 1.) {
		//float rayang = rand(5234, ray)*6.2+time*5.0*(rand(2534, ray)-rand(3545, ray));
		float rayang = ray * 1.2;
		rayang = mod(rayang, pi*2.0);
		if (rayang < ang - pi) {rayang += pi*2.0;} //needed to fix atan(x,y) 
		if (rayang > ang + pi) {rayang -= pi*2.0;}
		float brite = .05 - abs(ang - rayang);
		brite -= dist * 0.2;
		if (brite > 0.0) {
			gl_FragColor.rgb += vec3(0.2+1.2*ray, 0.4+1.5*ray, 0.5+1.9*ray) * t * brite;
		}
	}
	gl_FragColor.a = 1.0;
}