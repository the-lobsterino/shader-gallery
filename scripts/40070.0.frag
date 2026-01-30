#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float intensity = 0.;
	for (float i = 0.; i < 54.; i++) {
		float angle = i/27. * 3.14159;
		vec2 xy = vec2(0.25 * cos(angle), 0.25 * sin(angle));
		xy += gl_FragCoord.xy/resolution.y-0.5;
		xy.x -= 0.25;
		intensity += pow(1000000., (0.77 - length(xy) * 1.9) * (1. + 0.275 * fract(-i / 17. - time))) / 80000.;
	}
	gl_FragColor = vec4(clamp(intensity * vec3(0.077, 0.096, 0.67), vec3(0.), vec3(1.)), 1.);
}