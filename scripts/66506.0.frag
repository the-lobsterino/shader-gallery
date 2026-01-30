#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	vec3 a = mod(p, 2.0) - 1.0;
	float t0 = length(max(abs(a) - 0.5, 0.0)) - 0.01;
	float t1 = length(max(abs(a - 0.1) - 0.5, 0.0)) - 0.01;
	float t2 = length(max(abs(a + 0.5) - 0.35, 0.0)) - 0.01;
	return max(-t1, t0);
}

void main( void ) {
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 pos = vec3(0, 0, time);
	vec3 dir = normalize(vec3(uv, 1.0));
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		t += map(pos + dir * t) * 0.5;
	}
	
	gl_FragColor = vec4(t * 0.1);

}