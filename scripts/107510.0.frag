#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	const int steps = 12;
	const vec3 coeff = vec3(0.2, 0.5, 1.0);
	
	vec3 scattering = vec3(0.0);
	vec3 transmittance = vec3(1.0);
	float dist = position.x * 44.;
	
	float increment = dist / float(steps);
	
	for (int i = 0; i < steps; i++) {
		float od = increment;
		
		vec3 stepTransmittance = exp(-od * coeff);
		scattering += (1.0 - stepTransmittance) * transmittance;
		
		transmittance *= stepTransmittance;
	}

	vec3 color = vec3(scattering);

	gl_FragColor = vec4(pow(color, vec3(1.0 / 2.2)), 1.0 );

}