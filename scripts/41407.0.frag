#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main() {
	float intensity = 0.;
	for (float i = 0.; i < 90.; i++) {
		float angle = i/90. * 2. * 3.14159;
		vec2 xy = vec2(0.35 * cos(angle) - sin(time * 2.) * .2 , 0.35 * sin(angle) - cos(time * 2.) * .12);
		xy += gl_FragCoord.xy/resolution.y-.5;
		xy.x += -.5;
		intensity += pow(600000., (0.73 - length(xy) * 2.6) * (1. + 0.35 * fract(-i/30. - time))) / 70000.;
	}
	gl_FragColor = vec4(clamp(intensity * vec3(0., 0.07, 0.1), vec3(0.), vec3(1.)), 1.);
}