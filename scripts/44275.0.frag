#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float terrain(in vec2 p) {
	p *= 0.2;
	float height = 0.0;
	float amp = 1.0;
	for (int i = 0; i < 10; i++) {
		height += amp * sin(p.x) * sin(p.y);
		amp *= 0.5;
		p *= 2.07;
	}
	return height * 5.0;
}

vec3 normal(in vec2 p) {
	float epsilon = 0.02;
	return normalize(vec3(
		terrain(p + vec2(epsilon, 0.0)) - terrain(p - vec2(epsilon,0.0)),
		2.0 * epsilon,
		terrain(p +vec2(0.0, epsilon)) - terrain(p - vec2(0.0, epsilon))
	));
}

const float tmax = 100.0;
float raymarch(in vec3 origin, in vec3 direction) {
	float t = 0.0;
	for (int i = 0; i < 64; i++) {
		vec3  p = origin + t * direction;
		float height = terrain(p.xz);
		float distance = p.y - height;
		if(distance < 0.02 || t > tmax) {break;}
		t += 0.2 * distance;
	}
	return t;
}

void main( void ) {

	vec2 st = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	float time = time * 2.0;
	
	vec3 origin = vec3(0.0, 10.0, 0.0 - time);
	vec3 target = vec3(0.0, 8.0, -5.0 - time);
	vec3 cz = normalize(target - origin);
	vec3 cx = cross(cz, vec3(0.0, 1.0, 0.0));
	vec3 cy = cross(cx, cz);
	vec3 direction = vec3(cx * st.x + cy * st.y + cz * 1.0);
	
	float t = raymarch(origin, direction);
	vec3 c = vec3(0.0);
	if (t < tmax) {
		vec3 p = origin + t * direction;
		vec3 n = normal(p.xz);
		c = n * 0.5 + 0.5;
	}
	gl_FragColor = vec4(c, 1.0);
}