// Tenjix

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;

const float CloakWavePosition = 0.0;
const float CloakWaveScale = 1.0;

float CloakWaveBand(vec2 pos, float amplitude, float frequency) 
{
	float wave = CloakWaveScale * amplitude * sin(2.0 * PI * frequency * pos.x + (time * -4.0)) / 2.05;
	float light = clamp(amplitude * frequency * 0.002, 0.002 + 0.001 / CloakWaveScale, 2.0) * CloakWaveScale / abs(wave - pos.y);
	return light;
}

void main( void ) {

	vec3 color = vec3(1.0, 1.0, 1.0);
	vec2 pos = (gl_FragCoord.xy / resolution.xy);
	pos.y += - 0.5 - CloakWavePosition;
	
	float spectrum = 0.0;

	spectrum += CloakWaveBand(pos, 1.0, 1.0);
	spectrum += CloakWaveBand(pos, 0.7, 2.5);
	spectrum += CloakWaveBand(pos, 0.4, 2.0);
	spectrum += CloakWaveBand(pos, 0.05, 4.5);
	spectrum += CloakWaveBand(pos, 0.1, 7.0);
	spectrum += CloakWaveBand(pos, 0.1, 1.0);
	
	vec4 finalColor = vec4(color * spectrum, spectrum); 
	float e = distance((gl_FragCoord.yy/resolution.yy), vec2(0.5,0.5));	
	finalColor *= smoothstep(0.4, 0.0, e);
	gl_FragColor = finalColor;
	
}