#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random( vec2 v ) {
	return fract(sin(dot(v, vec2(114.0, 514.0))) * 1919810.0) * 2.0 - 1.0;
}
	

float noise( vec2 v, float octave ) {
	vec2 maj = floor(v * pow(2.0, octave));
	vec2 sub = fract(v * pow(2.0, octave));
	float v00 = random(maj);
	float v10 = random(maj + vec2(1.0, 0.0));
	float v01 = random(maj + vec2(0.0, 1.0));
	float v11 = random(maj + vec2(1.0, 1.0));
	vec2 u = smoothstep(0.,1.,sub);
	
	return mix(v00, v10, u.x) +
		(v01 - v00)* u.y * (1.0 - u.x) +
		(v11 - v10) * u.x * u.y;
}

void main( void ) {
	vec2 st = gl_FragCoord.xy / min(resolution.x, resolution.y) + sin(time);
	float v = 0.0;
	for (int i = 0; i < 10; i ++) {
		v += noise(st, float(i)) / pow(2.0, float(i));
	}
	st+= time;
	gl_FragColor = vec4(vec3(v) * 0.5 + 0.5, 1.0);
}