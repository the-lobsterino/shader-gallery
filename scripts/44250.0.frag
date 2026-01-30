#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 cmult(vec2 a, vec2 b) {
	return vec2(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

void main( void ) {

	vec2 p = (gl_FragCoord.xy * 2.0 - resolution.xy) / resolution.y;
	
	vec2 z = vec2(0.0);
	vec2 dz = vec2(0.0);
	
	for (int i = 0; i < 128; i++) {
		if (length(z) > 2.0) {break;}
		dz = 2.0 * cmult(z, dz) + vec2(1.0, 0.0);
		z = cmult(z, z) + p;
	}
	
	
	float d = length(z) < 2.0 ? 0.0 : length(z) * log(length(z)) / length(dz);

	gl_FragColor = vec4(vec3(pow(d * 1.0 , 0.2)), 1.0);
}