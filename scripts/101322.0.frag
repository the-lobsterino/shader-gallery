#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define ITERATIONS 256

vec2 f(vec2 z, vec2 p) {
	float power = 2.0 + 5.0 * sin(time / 100.0);
	float r = log(pow(sqrt(z.x * z.x + z.y * z.y), power));
	float a = atan(z.y, z.x) * power;
	
	z = vec2(r * cos(a), r * sin(a));
	z += mouse * 2.0;
	
	return z;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy);

	p *= 2.0;

	p -= 1.0;
	
	float aspect = resolution.x / resolution.y;
	
	p.x *= aspect;

	vec2 z = p;
	
	float it = 0.0;
	
	for (int i = 0; i < ITERATIONS; ++i) {
		z = f(z, p);
		it += 1.0;
		if (z.x * z.x + z.y * z.y > 4.0) {
			break;
		}
	}

	vec3 color = vec3(1.0);
	
	
	if (z.x * z.x + z.y * z.y < 4.0) {
		color = vec3(0.0);
	} else {
		color = vec3(sin(it / 3.0 + time), cos(it / 5.0 + time / 3.0), sin(it / 5.0 + 1.2 + time / 5.0));
	}
	
	
	gl_FragColor = vec4(color, 1.0 );

}