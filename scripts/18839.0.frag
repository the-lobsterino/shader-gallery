#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float field(in vec3 p) {
	float strength = 4. + 0.001 * log(1.e-6 + fract(sin(time) * 4373.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 30; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-1.2, -.5, -1.445-sin(p)+sin(p/0.01));
		float w = exp(-float(i) / 8.);
		accum += w * exp(-strength * pow(abs(-mag - prev/50.), 1.5));
		tw += w;
		prev = mag;
	}
	return max(0., 5. * accum / tw - 0.7);
}

void main() {
	vec2 uv = 1.5 * gl_FragCoord.xy / resolution.xy - 1.;
	vec2 uvs = uv * resolution.xy / max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 1.,0) + vec3(5.9, -.3, 0.);
	p += 1.4 * vec3(sin(time / 40000.), cos(time / 120.),  sin(time / abs(18.))+cos(time / 18.));
	float t = field(p);
	float v = (1. - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 6.));
	gl_FragColor = mix(10.005*t, 100.*t*t/400., v/1.) * vec4(100.8*t* t * t * t, 100.9 * t * t, 0.*t, t*1.0);
}