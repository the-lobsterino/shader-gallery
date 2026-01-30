// Any ideas why I'd only see two lines instead of 50. on OSX?

#ifdef GL_ES
precision mediump float;
#endif

#define PI 3.1415926535897932384626433832795

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

const float position = 0.0;
const float scale = 1.0;
const float intensity = 1.0;

varying vec2 surfacePosition;
uniform sampler2D backbuffer;

float band(vec2 pos, float amplitude, float frequency) {
	float wave = scale * amplitude * sin(2.0 * PI * frequency * pos.x + (time/8.)-pos.x*pos.x*0.125) / 2.05;
	float light = clamp(amplitude * frequency * 0.002, 0.001 + 0.001 / scale, .5) * scale / (1e-5+abs(wave - pos.y));
	return light;
}

void main( void ) {
	vec2 surfacePosition = surfacePosition*vec2(3,1);
	vec3 color = vec3(.3, .5, .7);
	vec2 pos = surfacePosition;
	float spectrum = 0.0;
	const float lim = 50.;
	for(float i = 0.; i < lim; i+=0.5){
		spectrum = max(spectrum, band(pos, 1.90*sin(time*0.150), .10*sin(time*i/lim))/pow(lim, 0.20 + 0.0133*cos(time)));
	}
	gl_FragColor = vec4(color * spectrum, 1.);
	
	#define t2(d) (texture2D(backbuffer, fract((d+gl_FragCoord.xy)/resolution))-6./256.)
	#define t3(d) ((t2(d+vec2(1,0))+t2(d+vec2(-1,0))+t2(d+vec2(0,1))+t2(d+vec2(0,-1)))/4.)
	#define t4(d) ((t3(d+vec2(2,0))+t3(d+vec2(-2,0))+t3(d+vec2(0,2))+t3(d+vec2(0,-2)))/4.)
	
	gl_FragColor = max(gl_FragColor, t4(normalize(-surfacePosition)));
}//+ptkfs