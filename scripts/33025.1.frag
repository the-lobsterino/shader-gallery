#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define UNITS 10.0
#define SPEED 15.1

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;



float ball(vec2 uv, vec2 pos) {
	return length(uv - pos) * 25.0;
}

vec3 colorFunc(float g) {
	float h = 2. * g;
	float x = 1.0 - abs(mod(h / 60.0, 2.0) - 1.0);
	
	vec3 col;
	if (h < 60.0)
		return col = vec3(1.0, x, 0.0);
	else if (h < 120.0)
		return col = vec3(x, 1.0, 0.0);
	else if (h < 180.0)
		return col = vec3(0.0, 1.0, x);
	else if (h < 240.0)
		return col = vec3(0.0, x, 1.0);
	else if (h < 300.0)
		return col = vec3(x, 0.0, 1.0);
	else if (h < 360.0)
		return col = vec3(1.0, 0.0, x);
	return vec3(0.);
}

void main( void ) {
	//gl_FragColor=vec4(0); //uncomment to fix or else see thumbnail
	vec2 asp = resolution / min(resolution.x, resolution.y);
	vec2 uv = (2.0 * gl_FragCoord.xy / resolution.xy - 1.0) * asp;
	
	vec2 m = (mouse * 2.0 - 1.0) * asp;
	
	vec2 m1 = vec2(0.1, 0.2);
	
	vec2 m2 = vec2(0., 0.2);
	
	for (float i = 0.0; i < 180.; i += (360./UNITS)) {
		float d = ball(uv, clamp(vec2(length(m1)*sin(time * SPEED + (i / 180.) * 3.14), length(m1)*cos(time * SPEED + (i / 180.) * 3.14)), vec2(-abs(m1.x), -abs(m1.y)), vec2(abs(m1.x), abs(m1.y))));
		gl_FragColor += 0.4 * vec4((colorFunc(i)/ d) - 0.01, 1.);
	}
	
	for (float i = 0.0; i < 180.; i += (360./UNITS)) {
		float d = ball(uv, vec2(0.4, 0.0) + clamp(vec2(length(m1)*sin(time * SPEED + (i / 180.) * 3.14), length(m1)*cos(time * SPEED + (i / 180.) * 3.14)), vec2(-abs(m1.x), -abs(m1.y)), vec2(abs(m1.x), abs(m1.y))));
		gl_FragColor += 0.4 * vec4((colorFunc(i)/ d) - 0.01, 1.);
	}
	
	for (float i = 0.0; i < 180.; i += (360./UNITS)) {
		float d = ball(uv, vec2(-0.4, 0.0) + clamp(vec2(length(m2)*sin(time * SPEED + (i / 180.) * 3.14), length(m2)*cos(time * SPEED + (i / 180.) * 3.14)), vec2(-abs(m2.x), -abs(m2.y)), vec2(abs(m2.x), abs(m2.y))));
		gl_FragColor += 0.3 * vec4((colorFunc(i)/ d) - 0.01, 1.);
	}
	
}