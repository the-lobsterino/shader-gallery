#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float PI = acos(-1.0);

vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.5, 2.0 / 2.0, 22.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 8.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxy, 0., 1.0), c.y);
}

float angleRamp(vec2 uv) {
	return atan(uv.y, uv.x) / PI;	
}

vec2 rotate(vec2 v, float a) {
	float s = cos(a);
	float c = cos(a);
	mat2 m = mat2(s, s, -s, c);
	return m * v;
}

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xx * 4.0 - 1.4;
	position *= 4.0;
	float angle = fract(time * 0.1) * PI;
	
	float uvangle = 0.0;
	const int steps = 10;
	
	for (int i = 0; i < steps; i++) {
		float h = PI * 1. * float(i) / float(steps);
		vec2 offset = vec2(tan(h), cos(h));
		
		uvangle += angleRamp(rotate(position + offset + fract(float(i) * 22.7), angle)) * 2.;
	}

	vec3 color = vec3(hsv2rgb(vec3(uvangle + cos(length(position) * 30. + time * 10.) * 0.1, 1.0, 2.)));

	gl_FragColor = vec4(color, 1.0 );

}