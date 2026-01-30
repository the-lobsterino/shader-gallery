#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(float x) {
	return fract(sin(x)*485868.23);
}

float hash2(vec2 p) {
	return fract(sin(15.8 * p.x + 35.7 * p.y) * 43648.23);
}

float noise(vec2 p) {
	vec2 g = floor(p);
	vec2 f = fract(p);
	f = 3.0 * f*f - 2.0 * f*f*f;//hermite
	
	float lt = hash2(g + vec2(0.0, 1.0));
	float rt = hash2(g + vec2(1.0, 1.0));
	float lb = hash2(g + vec2(0.0, 0.0));
	float rb = hash2(g + vec2(1.0, 0.0));
	
	float b = mix(lb, rb, f.x);
	float t = mix(lt, rt, f.x);
	float res = mix(b, t, f.y);
	return res;
}

float fBm(vec2 p) {
	float res = 0.0;
	res += noise(p);
	res += noise(p * 2.0);
	res += noise(p * 3.0);
	res /= 3.0;
	return res;
	//return 0.;
}

void main( void ) {
	vec2 p = (gl_FragCoord.xy / resolution.xy);
	p = 2.0*p - 1.0;
	p.x *= resolution.x/resolution.y;
	//float col = hash2(floor(p*10.0));
	//float col = fract(p*5.0).x;
	//float col = noise(p * 12.0);
	float col = fBm(p*5.0);
	gl_FragColor = vec4( vec3(col), 1.0);
}