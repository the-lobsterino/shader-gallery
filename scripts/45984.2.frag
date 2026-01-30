#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	vec2 pos = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y) * 1.0;
	vec2 p = pos;
	for(int i = 1; i < 6; i++) {
		p += sin(p.yx * vec2(1.6, 1.1) * float(i + 5) + time * float(i) * vec2(-3.4, 0.0) / 10.0) * 0.1;
	}
	float a = (abs(sin(p.x + 0.7 * sin(2.0 * p.y - time * 0.7))));
	float c = (abs(sin(p.x + 0.7 * sin(2.0 * p.y - time * 0.7 - 0.4))));
	vec4 smoke = vec4(vec3(pow(c, 2.0) * 0.2 + 0.8), a * 0.2 + 0.8);

	float check = mod(step(mod(5.0 * pos.x, 1.0), 0.5) + step(mod(5.0 * pos.y, 1.0), 0.5), 2.0);
	vec4 back = vec4(1.0, 0.5, 0.7, 1.0) * check + vec4(0.5, 0.7, 1.0, 1.0) * (1.0 - check);
	gl_FragColor = vec4(smoke.rgb * smoke.a + back.rgb * (1.0 - smoke.a), 1.0);
}