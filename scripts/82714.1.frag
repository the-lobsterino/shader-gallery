#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define interp(edge0, edge1, x) (edge0 * (1.0 - x) + edge1 * x)

float random( vec3 v ) {
	return fract(tan(dot(v, normalize(vec3(4.0, 54.0, 80.0)))) * 1919.0) * 2.0 - 1.0;
}

float noise( vec3 v, float octave ) {
	vec3 maj = floor(v * pow(2.0, octave));
	vec3 sub = fract(v * pow(2.0, octave));
	float v000 = random(maj);
	float v100 = random(maj + vec3(1.0, 0.0, 0.0));
	float v010 = random(maj + vec3(0.0, 1.0, 0.0));
	float v110 = random(maj + vec3(1.0, 1.0, 0.0));
	float v001 = random(maj + vec3(0.0, 0.0, 1.0));
	float v101 = random(maj + vec3(1.0, 0.0, 1.0));
	float v011 = random(maj + vec3(0.0, 1.0, 1.0));
	float v111 = random(maj + vec3(1.0, 1.0, 1.0));
	sub.x = smoothstep(0., 1., sub.x);
	sub.y = smoothstep(0., 1., sub.y);
	sub.z = smoothstep(0., 1., sub.z);
	
	float vx00 = interp(v000, v100, sub.x);
	float vx10 = interp(v010, v110, sub.x);
	float vx01 = interp(v001, v101, sub.x);
	float vx11 = interp(v011, v111, sub.x);
	float vxy0 = interp(vx00, vx10, sub.y);
	float vxy1 = interp(vx01, vx11, sub.y);
	return interp(vxy0, vxy1, sub.z);
}

void main( void ) {
	vec3 st = vec3(gl_FragCoord.xy / min(resolution.x, resolution.y), time / 80.0);
	vec3 n = vec3(0.0);
	for (int i = 0; i < 4; i ++) {
		n.x += noise(st.yxz, float(i)) / pow(2.0, float(i));
		n.y += noise(st.zyx, float(i)) / pow(2.0, float(i));
		n.z += noise(st.xzy, float(i)) / pow(2.0, float(i));
	}
	
	n *= 1.2; // / pow(distance(mouse, gl_FragCoord.xy / resolution.xy), 0.5);
	
	vec3 v = vec3(0.0);
	for (int i = 0; i < 13; i ++) {
		v.x += noise(st.xyz + n, float(i)) / pow(2.0, float(i));
		v.y += noise(st.yzx + n, float(i)) / pow(2.0, float(i));
		v.z += noise(st.zxy + n, float(i)) / pow(2.0, float(i));
	}
	gl_FragColor = vec4(vec3(v.x * 0.3 + 0.5), 1.0);
}