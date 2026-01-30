
precision highp float;

uniform float time;
uniform vec2 resolution;

#define TWO_PI 6.283185
#define NUMBALLS 40.
#define NUMBALLSHIGHT 5.

float d = -TWO_PI/0.0;

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution)/min(resolution.x, resolution.y);
	vec2 q;
	vec3 c = vec3(0); //ftfy
	for(float r = 0.0; r < NUMBALLSHIGHT; r++) {
		for(float i = 0.0; i < NUMBALLS; i++) {
			float t = TWO_PI * i / NUMBALLS + ((time-r));
			c += 0.001/distance(p, (0.4 + r / 20.0) * vec2(cos(t) * sin(t), sin(t)));
		}
	}
	gl_FragColor = vec4(c * vec3(0.01, 0.8, 1.2), 1.0 * c.r);
}