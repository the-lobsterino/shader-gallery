#ifdef GL_ES
precision highp float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 directionalWaveNormal(vec2 p, float amp, vec2 dir, float freq, float speed, float time, float k) {	
	float a = dot(p, dir) * freq + time * speed;
	float b = 0.5 * k * freq * amp * pow((sin(a) + 1.0) * 0.5, k - 1.0) * cos(a);
	return vec2(dir.x * b, dir.y * b);
}

vec3 summedWaveNormal(vec2 p) {
	
	vec2 sum = vec2(0.0);
	sum += directionalWaveNormal(p, 0.5, normalize(vec2(1, 1)), 5.0, 1.5, time, 1.0);
	sum += directionalWaveNormal(p, 0.25,normalize(vec2(1.4, 1.0)), 11.0, 2.4, time, 1.5);
	sum += directionalWaveNormal(p, 0.125, normalize(vec2(-0.8, -1.0)), 10.0, 2.0, time, 2.0);
	sum += directionalWaveNormal(p, 0.0625, normalize(vec2(1.3, 1.0)), 15.0, 4.0, time, 2.2);
	sum += directionalWaveNormal(p, 0.03125, normalize(vec2(-1.7, -1.0)), 5.0, 1.8, time, 3.0);
	return normalize(vec3(-sum.x, -sum.y, 1.0));
}

void main( void ) {

	vec2 p = 2.0 * (gl_FragCoord.xy / resolution.y)  - resolution.xy / resolution.y;

	vec3 normal = summedWaveNormal(p);
	
	vec3 c = mix(vec3(0.31, 0.15, 0.1), vec3(0.2, 0.25, 0.4),  dot(normal, normalize(vec3(0.1, 0.2, 0.5))) * 0.5 + 0.5);
	c = mix(c, vec3(0.7, 0.9, 1.0), pow(dot(normal, normalize(vec3(-0.4, 0.1, 1.0))) * 0.5 + 0.5, 2.0));
	c = mix(c, vec3(0.9, 0.98, 1.0), pow(dot(normal, normalize(vec3(-0.1, -0.3, 0.5))) * 0.5 + 0.5, 10.0));
	
	gl_FragColor = vec4(c, 1.0);
}