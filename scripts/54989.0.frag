#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy);

	gl_FragColor = vec4(vec3(1.0), 1.0);

	for (float i = 0.0; i <= 3.0; i += 1.0) {
		float scale = pow(3.0, i);

		vec2 p = vec2(mod((position.x * scale), 3.0), mod((position.y * scale), 3.0));

		if (p.x >= 1.0 && p.x <= 2.0 && p.y >= 1.0 && p.y <= 2.0) {
			gl_FragColor = vec4(vec3(0.0), 1.0);
		}
	}
}