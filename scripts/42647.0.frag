#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	float intensity = 0.;
	for (float i = 0.; i < 55.; i++) {
		float angle = i/55. *2. *3.14159;
		vec2 xy = vec2(0.4 * cos(angle), 0.4 * sin(angle));
		xy += gl_FragCoord.xy/resolution.y-0.5;
		intensity += pow(100000000., (0.81100040000077 - length(xy) * 2.9) * (1. + 0.25 * fract(-i / 1000000000000000. - time))) / 800000.;
	}
	gl_FragColor = vec4(clamp(intensity * vec3(1.066666, 0.1196, 0.055), vec3(0.), vec3(100.)), 100.);
}