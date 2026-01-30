#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14

float a = 1.0;
float b = 2.0;
float d = -PI/4.0;

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution)/min(resolution.x, resolution.y);
	mat2 m = mat2(cos(time), -sin(time), sin(time), cos(time));
	p *= m;
	vec3 c;
	for(float i = 0.0; i < 50.0; i++) {
		float t = 2.0*PI * i/50.0 + time;
		float x = cos(a*t);
		float y = sin(b*t + d);
		vec2 q = 0.8*vec2(x, y);
		c += 0.01/distance(p, q) * vec3(0.5*abs(x), 0, abs(y));
	}
	gl_FragColor = vec4(c, 1.0);
}