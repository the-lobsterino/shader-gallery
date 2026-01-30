#ifdef GL_ES
precision highp float;
#endif

uniform float time;
uniform vec2 resolution;

vec2 cexp (vec2 z) {
	return exp(z.x) * vec2(cos(z.y), sin(z.y));
}

vec2 clog (vec2 z) {
	return vec2(log(length(z)), atan(z.y, z.x));
}

void main (void) {

	vec3 col = vec3(0.0);
	
	vec2 c = ((gl_FragCoord.xy - resolution / 2.0) / min(resolution.x, resolution.y)) * 4.0 + vec2(0.0, 0.0);
	vec2 z = c;
	
	for (int i = 0; i < 64; i++) {
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) - sin(time) * clog(z) - cos(time) * cexp(z);
		if (length(z) >= 4.0) {
			col = vec3(float(i) / 8.0);
		}
	}
	
	gl_FragColor = vec4(col, 1.0);

}