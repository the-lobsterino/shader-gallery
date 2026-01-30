#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float map(vec3 p) {
	return cos(p.x) + cos(p.y) + cos(p.z);
}

void main( void ) {

	vec2 uv = ( 2.0 * gl_FragCoord.xy - resolution.xy ) / min(resolution.x, resolution.y);
	vec3 dir = normalize(vec3(uv, 1.0));
	vec3 pos = vec3(0, 0, time);
	float t = 0.0;
	float dens = 0.0;
	for(int i = 0 ; i < 100; i++) {
		float a = map(dir * t + pos);
		dens += a * 0.5;
		t += 0.5;
	}
	vec3 ip = dir * t + pos;
	gl_FragColor = vec4(ip * dens * 0.01, 1.0);

}