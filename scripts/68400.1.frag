#ifdef GL_ES
precision mediump float;
#endif

#define NMAX 1000

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float getValue(vec2 p, vec2 c) {
	float value = 0.0;
	vec2 aux;
	for (int i = 0; i < NMAX; i++) {
		aux.x = p.x * p.x - p.y * p.y + c.x;
		aux.y = 2.0 * p.x * p.y + c.y;
		p = aux;
		if (dot(p, p) < 4.0) {
			value += 1.0 / float(NMAX);
		}
	}
	return value;
}

vec3 interpolate(float value) {
	
	if (value < 0.05) {
		return mix(vec3(0.1, 0.1, 0.4), vec3(0.2, 0.24, 0.7), value / 0.05);
	} else if (value < 0.5) {
		return mix(vec3(0.2, 0.24, 0.7), vec3(0.5, 0.7, 0.4), (value - 0.05) / 0.45);
	}
	return mix(vec3(0.5, 0.7, 0.4), vec3(0.7, 0.4, 0.3), (value - 0.5) / 0.5);
	
}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0) * 2.0 - (mouse * 2.0 - 1.0) / 2.0;
	vec2 c = 0.5885 * vec2(cos(time * 2.0), sin(time * 0.3));
	
	float value = getValue(position, c);
	value = pow(value, 0.5);
	vec3 color = interpolate(value);
	gl_FragColor = vec4(color, 1.0);
}