#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(float min1, float max1, float min2, float max2, float value) {
	return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

void main( void ) {
	float range = 5.;
	float mult = 1.; //resolution.y / resolution.x;
	float x = map(0., resolution.x, -range, range, gl_FragCoord.x);
	float y = map(0., resolution.y, -range * mult, range * mult, gl_FragCoord.y);
	float inside = abs(x*x - y) / 3.;
	gl_FragColor = vec4(vec3(clamp(inside, 0., 1.)), 1.0);
}