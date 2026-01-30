
precision highp float;

uniform float time;
uniform vec2 resolution;

#define TWO_PI 6.283185
#define NUMBALLS 38.
#define NUMBALLSHIGHT 4.

float d = -TWO_PI/0.0;
float ti = time + 50.0;

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution)/min(resolution.x, resolution.y);
	vec2 q;
	vec3 c = vec3(0); //ftfy
	for(float r = 0.0; r < NUMBALLSHIGHT; r++) {
		for(float i = 0.0; i < NUMBALLS; i++) {
			float t = TWO_PI * i / NUMBALLS + ((ti-r));
			c += 0.0009/distance(p, (0.3 + r / 20.0) * vec2(cos(t) * sin(t / 4.0), cos(t * time / 6000.0)));
		}
	}
	gl_FragColor = vec4(c *  vec3(0.3, .4, .8), 0.9 * c.r);
}