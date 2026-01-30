#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float g(float x) {
	return 1.0 / pow(2.0, pow(x, 2.0));
}

float j(float x) {
	return 3.0 * pow(x, 2.0) - 2.0 * pow(x, 3.0);
}

float h(float x) {
	return 2.0 * j(0.25 * x + 0.5) - 1.0;
}

float f(float x, float i, float u ) {
	return g(x) * sin(i * pow(h(x), 3.0) + i * time * 0.1- u * 20.1);
}

void main( void ) {

	vec2 uv = 2.0 * gl_FragCoord.xy - resolution.xy;
	uv /= resolution.x;
	uv *= 10.5;
	float u = floor(uv.x / 4.0);
	uv.x = mod(uv.x, 4.0) - 2.0;
	
	vec3 c;
	float x = 1.0;
	for (float i = 1.0; i <= 9.0; i++) {
		x *= smoothstep(0.4, 0.8, pow(distance(uv.x, f(uv.y * 1.0, i, u)), 0.1));
	}
	
	c = vec3(x, x, x);

	gl_FragColor = vec4(c, 1.0 );

}