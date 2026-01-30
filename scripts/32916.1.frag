#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define NUM 30.0

float ball(vec2 uv, vec2 pos) {
	return length(uv - pos) * 200.0;
}

vec3 colorFunc(float h) {
	float x = 1.0 - abs(mod(h / 60.0, 2.0) - 1.0);
	
	vec3 col;
	if (h < 60.0)
		col = vec3(1.0, x, 0.0);
	else if (h < 120.0)
		col = vec3(x, 1.0, 0.0);
	else if (h < 180.0)
		col = vec3(0.0, 1.0, x);
	else if (h < 240.0)
		col = vec3(0.0, x, 1.0);
	else if (h < 300.0)
		col = vec3(x, 0.0, 1.0);
	else if (h < 360.0)
		col = vec3(1.0, 0.0, x);
	return col;
}

void main( void ) {
	vec2 asp = resolution / min(resolution.x, resolution.y);
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * asp;
	
	vec2 m = vec2(cos(time), sin(time));//asp * (mouse * 2.0 - 1.0);
	vec2 s = vec2(m.x + cos(time), m.y + sin(time));

	for (float i = 0.0; i < NUM; i++) {	
		float d = ball(uv, m * vec2(cos(i + time*i), sin(i + time*i)));
		gl_FragColor += vec4(colorFunc(i * 360. / NUM) / d, 1.0);
		
		float e = ball(uv, m * vec2(cos(i*i + time*i), sin(i + time*i)));
		gl_FragColor += vec4(colorFunc(i * 360. / NUM) / e, 1.0);
	}
}