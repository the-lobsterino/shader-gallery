#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash12(vec2 x) {
	return fract(sin(dot(x, vec2(39.56, 17.31))) * 49645.423) * 2.0 - 1.0;
}

vec2 hash22(vec2 x) {
	return fract(sin(vec2(dot(x, vec2(39.56, 17.31)),dot(x, vec2(23.79, 13.18)))) * 49645.423) * 2.0 - 1.0;
}

float noise(vec2 x) {
	vec2 p = floor(x);
	vec2 q = fract(x);
	
	vec2 u = q * q * (3.0 - 2.0 * q);
	
	float a = dot(hash22(p + vec2(0.0, 0.0)), vec2(0.0, 0.0) - q);
	float b = dot(hash22(p + vec2(1.0, 0.0)), vec2(1.0, 0.0) - q);
	float c = dot(hash22(p + vec2(0.0, 1.0)), vec2(0.0, 1.0) - q);
	float d = dot(hash22(p + vec2(1.0, 1.0)), vec2(1.0, 1.0) - q);

	return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

vec3 marble(vec2 x) {
	float v = 0.0;
	float f = 1.0;
	for (int i = 0; i < 5; i++) {
		v += noise(x * f) / f;
		f *= 2.17;
		
	}
	v = pow(clamp(1.7 * v + .2, 0.0, 1.0), 2.5);
	return mix(vec3(0.99, 0.97, 0.96), vec3(0.19, 0.20, 0.23), v);
}

void main( void ) {

	vec2 st = gl_FragCoord.xy / resolution.y;
	
	gl_FragColor = vec4(vec3(marble(st  * 5.0 + time)), 1.0);
	


}