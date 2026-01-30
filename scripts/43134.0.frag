#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;

void main(void) {
	vec3 uv = vec3(gl_FragCoord.xy / resolution.xy, sin(time));

	uv *= mat3(
		-sin(time), abs(tan(time)), sin(time),
		-cos(time), -cos(time), -cos(time),
		sin(time), -cos(time), -sin(time)
		) * -1.0;

	gl_FragColor = vec4(uv, .5);
}
