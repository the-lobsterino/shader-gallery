precision mediump float;

uniform float time;
uniform vec2 resolution;

float sinx(float x) {
	float v=sin(x);
	return sign(v)*pow(abs(v),0.6);
}

void main( void ) {
	vec2 p = (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);

	float width = 0.7 * (sin(p.y * 2.0 / (1.3 + sin(time * 0.4)) - sin(time) * 3.0) + 1.5) / 2.5;
	if(abs(p.x) < width) {
		float c = pow(abs(sin(asin(p.x / width) + time + sin(p.y + time * 3.0))),8.0);
		gl_FragColor = vec4(vec3(1.0, 0.7, 0.5) * c + vec3(0.1, 0.0, 0.0), 1.0);
	} else {
		gl_FragColor = vec4(vec3(0.6, 0.1, 0.2) * (p.y + 2.0) * 0.33, 1.0);
	}
}

