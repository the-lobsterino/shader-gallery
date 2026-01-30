#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;

const float position = 1.0;
const float scale = 1.0;
const float intensity = 1.0;

varying vec2 surfacePosition;

float band(vec2 pos, float amplitude, float frequency) {
	float wave = scale * amplitude * sin(2.0 * PI * frequency * pos.x + time) / 2.05;
	float light = clamp(amplitude * frequency * 0.002, 0.001 + 0.001 / scale, 5.0) * scale / abs(wave - pos.y);
	return light;
}

void main( void ) {

	vec3 color = vec3(0.15, 0.5, 1.0);
	color = color == vec3(0.0)? vec3(0.5, 0.5, 1.0) : color;
	vec2 pos = surfacePosition;//(gl_FragCoord.xy / resolution.xy);
	//pos.y += - 0.5 - position;
	
	// +pk
	float spectrum = 0.3;
	const float lim = 128.;
	#define time time*0.037 + pos.x*10.
	for(float i = 0.; i < lim; i++){
		spectrum += band(pos, 1.0*sin(time*0.7), 1.0*sin(time*i/lim))/pow(lim, 0.95);
	}
	
	
	gl_FragColor = vec4(color * spectrum, spectrum);
	
}