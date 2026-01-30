#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float field(in vec3 p) {
	float strength = 5. + 0.001 * log(1.e-6 + fract(sin(time) * 43.11));
	float accum = 0.;
	float prev = 0.;
	float tw = 0.;
	for (int i = 0; i < 30; ++i) {
		float mag = dot(p, p);
		p = abs(p) / mag + vec3(-1.5, -.35, -0.9);
		float w = exp(-float(i) / 8.);
		accum += w * exp(-strength * pow(abs(-mag - prev/50.), 1.5));
		tw += w;
		prev = mag;
	}
	return max(0.23, 5.1 * accum / tw - 0.7);
}

void main() {
	vec2 uv = 2. * gl_FragCoord.xy / resolution.xy-1.;
	vec2 uvs = uv * resolution.xy * max(resolution.x, resolution.y);
	vec3 p = vec3(uvs / 100.,300.*uv) + vec3(15.9*2., -100.3, 100.);
	p += 0.3 * vec3(sin(time /8.), sin(time / 11.), cos(time / 10.));
	float t = field(p);
	float v = (1.05 - exp((abs(uv.x) - 1.) * 6.)) * (1. - exp((abs(uv.y) - 1.) * 12.));
	gl_FragColor = mix(1.2*t, 100.*t*t/100., v*0.8) * vec4(250.1*t* t * t * t, 20.9 * t * t, 11.*t, t*1.0);
}