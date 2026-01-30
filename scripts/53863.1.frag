#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;

const float position = 0.0;
const float scale = 1.0;
const float intensity = 1.0;

varying vec2 surfacePosition;

float band(vec2 pos, float amplitude, float frequency) {
	float wave = scale * amplitude * sin(2.0 * PI * frequency * pos.x ) / 2.05;
	float light = clamp(amplitude * frequency * 0.002, 0.001 + 0.001 / scale, 5.0) * scale / abs(wave - pos.y);
	return light;
}

void main( void ) {
	//vec2 surfacePosition = vec2(gl_FragCoord.x * 2., surfacePosition.y);
	vec2 surfacePosition = surfacePosition;//(2.0*gl_FragCoord.xy - resolution)/max(resolution.x, resolution.y);
	surfacePosition = vec2(surfacePosition.x * 2.+asin(sin(gl_FragCoord.x))*.125/resolution.y, surfacePosition.y );
	surfacePosition.x += -3.14/2.;
	vec3 color = vec3(0.3, 0.6, 0.9);
	color = color == vec3(0.0)? vec3(0.5, 0.5, 1.0) : color;
	vec2 pos = surfacePosition;
	float spectrum = 0.0;
	const float lim = 128.;
	#define time (time*0.004 + pos.x*4. - 58.5)
	for(float i = 0.; i < lim; i++){
		spectrum += band(pos, 1.0*sin(time*0.1), 1.0*sin(time*i/lim))/pow(lim, 0.420 + 0.133*cos(time*3e3+time));
	}
	
	gl_FragColor = vec4(color * spectrum, spectrum) * -sin(clamp(surfacePosition.x, -1., 0.))  + vec4(color * band(pos, 1.0*sin(time*0.1), 1.0*sin(time*0./1.))/pow(1., 0.420 + 0.133*cos(time*3e3+time)), 1);
}