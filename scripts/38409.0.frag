#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float map(vec3 p) {
	vec3 q = fract(p) * 2.0 - 1.0;
	return length(q) - 0.25;
}

float trace(vec3 o, vec3 r) {
	float t = 0.0;
	for (int i = 0; i < 32; ++i) {
		vec3 p = o + r * t;
		float d = map(p);
		t += d * 0.5;
	}
	return t;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	position = position * 2.0 - 1.0;
	position.x *= resolution.x / resolution.y;

	vec3 r = normalize(vec3(position, time/50.0));
	vec3 o = vec3(0.0, 0.0, -3.0);
	float t = trace(o, r);
	float fog = 1.0 / (1.0 + t * t * 0.1);
	vec3 fc = vec3(fog);

	gl_FragColor = vec4( fc, 1.0 );

}