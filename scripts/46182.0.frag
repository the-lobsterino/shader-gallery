#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define QUALITY 128.0
#define PI 3.14159265359


varying vec2 surfacePosition;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 csq(vec2 z1) {
	return vec2(z1.x*z1.x-z1.y*z1.y, 2.0*z1.x*z1.y);
}

vec3 mandel(vec2 p) {
	vec2 s = vec2(0.0);
	float d = 0.0;
	vec2 a = vec2(0.0);
	for (int i = 0; i < int(QUALITY); ++i) {
		s = csq(s) + p;
		d += length(s);
		a += normalize(s);
		if (length(s) > 3.5) {
			return hsv2rgb(vec3(sin(PI*float(i)/QUALITY + time * 1.0/PI), 0.9, 0.8));
		}
	}
	return vec3(0.0);
}

void main( void ) {

	vec2 p = surfacePosition;
	vec3 color = mandel(p);
	// vec3 color = hsv2rgb(vec3(sin(iter * 1.4 + time), 0.9, 0.8));

	gl_FragColor = vec4(color * vec3(1.0,1.4,0.8), 1.0);

}