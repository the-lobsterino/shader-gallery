#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14

float a = 3.0;
float b = 2.0;
float d = -PI/1.0;

void main( void ) {
	vec2 p = (2.0*gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	mat2 m = mat2(cos(time), -sin(time), sin(time), cos(time));
	p *= m;
	vec3 c; // = vec3(0) is needed here or else you see my thumbnail.
	for(float i = 0.0; i < 20.0; i++) {
		float t = 2.0*PI * i/30.0 + time;
		float x = cos(a*t);
		float y = sin(b*t + d);
		vec2 q = 1.1*vec2(x, y);
		c += 0.09/distance(p, q) * vec3(0.3*abs(x), 0, abs(y));
	}
	gl_FragColor = vec4(c, 1.0);
}