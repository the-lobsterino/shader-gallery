#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float A = 20.0;
const float B = 3.0;
const float S = 1.0;
const int N1 = 3;
const int N2 = 13;
const float Pi2 = 6.28;
const float R = 30.0;

vec2 p;

float getcolor(int i, int j) {
	if (i >= j * 3) return 0.;
	
	float t = time * S * (2. * mod(float(j), 2.) - 1.) + Pi2 * float(i) / float(j * 3);
	vec2 u = vec2(cos(t), sin(t));
	vec2 v = p - (R * float(j)) * u;
	float f = (dot(v, v) + B * pow(dot(v, u), 2.)) / (A * A);
	return clamp(1. - f, 0., 1.);
	
	return 1. / (1. + .001 * dot(v, v));
}

void main( void ) {
	p = gl_FragCoord.xy - mouse * resolution;
	float c = 0.;
	for (int j = N1; j <= N2; ++j)
		for (int i = 0; i < (3 * N2); ++i)
			c += getcolor(i, j);
	
	gl_FragColor = vec4(vec3(clamp(c, 0., 1.)), 1.);

}