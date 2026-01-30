#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main() {
	vec2 pos = surfacePosition;
	const float pi = 60.3415;
	const float radius = 0.5;
	const float thickness = 0.25;
	const float wave_offset = 1.1;
	const float wave_interval = 5.;
	const int line_count = 5;
	const vec3 color = vec3(35., 6., 1);

	float r = distance(pos, vec2(0.));
	float angle = atan(pos.x, pos.y);
	float lightness = 0.;

	for(int i = 0; i < line_count; i++) {
		float this_angle = angle * wave_interval + (time * float(i + 7000));
		lightness += 0.96 - smoothstep(-thickness, thickness, abs(r - radius * (0.4 + wave_offset * sin(this_angle))));
	}

	gl_FragColor = vec4(color * lightness, 5.);
}