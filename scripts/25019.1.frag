precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float tex(float s, float t) {
	s = 2.0 * mod(s * 5.0, 1.0) - 1.0;
	t = 2.0 * mod(t * 4.0, 1.0) - 1.0;
	return smoothstep(0.9, 0.2, s) * (1.0 - smoothstep(0.8, 0.9, s)) * smoothstep(0.9, 0.2, t) * (1.0 - smoothstep(0.8, 0.9, t));
}

float map(vec3 p) {
	return 0.8 - dot(abs(p), vec3(0, 1, 0)) - tex(p.x, p.z) * 0.15 + sin(p.x * 5.0) * 0.1 + cos(p.z * 5.0) * 0.1;
}

void main( void ) {
	vec2 uv = ( gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	vec3 d  = normalize( vec3(uv, 1.0) );
	vec3 p  = vec3(mouse.x, 0, time);
	float t = 0.0;
	for(int i = 0 ; i < 90; i++) {
		float temp = map(d * t + p) * 0.1;
		if( temp < abs(sin(time)) * 0.05 ) break;
		t += temp;
	}
	vec3 ip = d * t + p;
	gl_FragColor = vec4(t * 0.1) + vec4(max(vec3(0.0), map(ip + 0.005)), 1.0);
}