precision mediump float;

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;

const vec3 color = vec3(.3, .4, .7);
const float intensity = 1.;

float band(vec2 pos, float amplitude, float frequency) {
	float wave = amplitude * sin(2.0 * PI * frequency * pos.x + time) / 2.;
	float light = clamp(amplitude * frequency * 0.002, 0.001 + 0.001, 5.0) / abs(wave - pos.y + 0.5);
	return light * intensity;
}
void main(void) {
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	
	float spectrum;
	spectrum += band(pos, .9,  .5);
	spectrum += band(pos, -.7, 1.2);
	spectrum += band(pos, .5,  1.7);
	spectrum += band(pos, -.3, 0.9);
	
	gl_FragColor = vec4(color * spectrum, spectrum);
}