#ifdef GL_ES
precision mediump float;
#endif

const float pi = 3.14159265358979323846;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
void main( void ) {
	// p appears to be distance from center
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	
	vec3 destColor = vec3(1.0, 0.3, 0.7);
	
	float f = 0.0;
	float n = 3.0;
	float a = 2.0 * pi / n;
	for(float i = 0.0; i < 30.0; i++) {
		float o = mod(2.0 * time + length(p)*a*i, 2.0*pi);
		float s = sin(o + time) / 3.0;
		float c = cos(o) / 2.0;
		f += 0.00025 / abs(length(p + vec2(c, s)) - 0.3);
	}
	
	
	
	gl_FragColor = vec4(vec3(destColor * f), 1.0) + 0.9*texture2D(backbuffer, gl_FragCoord.xy/resolution);
}