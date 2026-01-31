#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution; 

struct spectralWave {
	float freq;
	float amp;
};
	
spectralWave createWave(float freq, float amp) {
	return spectralWave(freq, amp);
}
	
vec3 calculateConeColor(spectralWave wave) {
	vec3 dist1 = (wave.freq - vec3(560.0, 535.0, 445.0)) / vec3(50.0, 50.0, 50.0);
	float dist2 = (wave.freq - 407.0) / 40.0;
	
	return (exp(-dist1 * dist1) * vec3(0.92, 1.0, 0.95) + exp(-dist2 * dist2) * vec3(0.02, 0.00, 0.0)) * wave.amp;
}

vec3 blackBodyRadiation(float temperature, float wavelength) {
    const float h = 6.626e-34;  // Planck's constant
    const float c = 3.0e8;     // Speed of light
    const float k = 1.38e-23;  // Boltzmann constant

    float wavelength_m = wavelength * 1e-9;  // Convert wavelength from nm to meters

    // Calculate spectral radiance
    float spectralRadiance = (2.0 * h * c * c) / (pow(wavelength_m, 5.0) * (exp((h * c) / (wavelength_m * k * temperature)) - 1.0));

    // Convert spectral radiance to RGB color
    return calculateConeColor(createWave(wavelength, spectralRadiance));
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	vec3 color = vec3(0.0);
	vec3 bbColor = vec3(0.0);
	const float minFreq = 400.0;
	const float maxFreq = 700.0;
	const float freqStep = 50.0;
	float totalWeight = 0.0;

	for (float freq = minFreq; freq <= maxFreq; freq += freqStep) {
		float weight = 1.0;
		totalWeight += weight;
		bbColor += blackBodyRadiation(position.x * 40000.0, freq);
	}
	
	bbColor /= totalWeight;

	color = bbColor / max(bbColor.r, max(bbColor.g, bbColor.b));

	gl_FragColor = vec4(color, 1.0 );

}