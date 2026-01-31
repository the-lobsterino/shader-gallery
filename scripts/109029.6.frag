#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec2 rot(vec2 a, float t) {
	float s = sin(t);
	float c = cos(t);
	return vec2(
		c * a.x - s * a.y,
		s * a.x + c * a.y);
		
}
/*
float box(vec3 p, vec3 b) {
	vec3 d = abs(p) - b;
	return length(max(d, vec3(0)));
}
*/

float box(vec3 p, vec3 b) {
    p = abs(p) - b;
	return max(p.x, max(p.y, p.z));
}



float map(vec3 p) {
	float angle = floor(p.z) * 0.1;
	vec3 offset = vec3(cos(angle) * 2.0, sin(angle) * 2.0, 0.0);
	vec3 lp = mod(p - offset, vec3(4.0, 4.0, 1.0)) - vec3(4.0, 4.0, 1.0) * 0.5;
	
	lp.xy = rot(lp.xy, time + angle);
	return box(lp, vec3(0.5) * vec3(0.5, 1, 0.9));//length(mod(p, 2.0) - 1.0) - 0.2;
}

void main( void ) {
	vec2 duv = (gl_FragCoord.xy / resolution.xy ) * 2.0 - 1.0;
	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0.0, 0.0, time);
	float t = 0.0;
	for(int i = 0 ; i < 100; i++) {
		t += map(dir * t + pos);
	}

	vec3 ip = dir * t + pos;
	vec3 col = vec3(0.0);
	col = vec3(t * 0.1) * vec3(1, 2, 3) * map(ip - 0.1);
	//col *= 1.0 - dot(duv, duv * 0.7);
	gl_FragColor = vec4(col, 1.0);

}