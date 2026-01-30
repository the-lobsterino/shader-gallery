#ifdef GL_ES //g
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define SAMPLES 4

vec3 st(vec2 uv) {
	float k = mod(0.3 * time + (uv.x * 5.0 - uv.y * 1.5), 1.0);
	return k < 0.33333 ? vec3(1.0, 1.0, 1.0) : k < 0.66666 ? vec3(0.70, 0.90, 1.0) : vec3(1.0, 0.8, 0.9);
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy );
	vec3 col = vec3(0.0);
	for(int i = 0 ; i < SAMPLES; i++) {
		float k = (float(i) / float(SAMPLES)) * 3.141592 * 2.0;
		vec2 dir = vec2(cos(k), sin(k));
		col += st(uv + dir / 2048.0);
	}
	col /= float(SAMPLES);
	gl_FragColor = vec4(col, 1.0);
}