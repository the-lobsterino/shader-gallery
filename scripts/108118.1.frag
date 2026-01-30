#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
    return a + b*cos( 6.28318*(c*t+d) );
}

vec3 pal1(in float x) {
	return pal(x, vec3(0.5, 0.5, 0.5), vec3(0.5, 0.5, 0.5), vec3(2.0, 1.0, 0.0), vec3(0.50, 0.20, 0.25));
}

vec2 complex_mul(vec2 a, vec2 b) {
	vec2 ret;
	ret.x = (a.x * b.x) - (a.y * b.y);
	ret.y = (a.x * b.y) + (a.y * b.x);
	return ret;
}

void main( void ) {
	float zoom = 3.0;
	vec2 z = gl_FragCoord.xy / resolution.xy * zoom;
	z.x /= resolution.y / resolution.x;
	z.y -= zoom / 2.0;
	z.x -= zoom;
	vec2 c = z;

	const int a = 20;
	for  (int i = 0; i < a; i++) {
		z   = complex_mul(z, z) + c;
		if (length(z) > 2.0) {
			float w = float(i) / float(a);
			gl_FragColor = vec4(pal1(w), 1.0);
			return ;
		}
	}
	gl_FragColor = vec4(pal1(1.0), 1.0);
}
