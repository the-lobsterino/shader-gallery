#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM_PARTICLES 50.
#define iTime time
#define iResolution resolution

#define R iResolution.xy

float Cir (vec2 uv, float r, bool blur) {
    float a = blur ? 0.01 : 0.;
    float b = blur ? 0.13 : 5./R.y;
    return smoothstep(a, b, length(uv)-r);
}
void main( void ) {
	float intensity = .2;
	vec2 fragPosition = gl_FragCoord.xy/resolution.y-vec2(0.5*resolution.x/resolution.y, 0.5);
	for (float i = 0.; i < NUM_PARTICLES; i++) {
		float angle = i / NUM_PARTICLES * 2.0 * 3.14159;
		float rotatedAngle = angle + time * 1.0;
		vec2 xy = vec2(cos(rotatedAngle), sin(rotatedAngle)) * 0.256;
		float amp = 0.007 * (1.0 + sin(angle * 3.0 * (sin(time)+1.0)));
		intensity += pow(0.1, 1.0 - (amp / length(xy - fragPosition)));
	}
	gl_FragColor = vec4(clamp(intensity * vec3(0.1, 0.1, 0.1), vec3(0.2), vec3(1.)), 1.);
}