#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash11(float p) {
	return fract(sin(p) * 45768.23);
}

float hash21(vec2 p) {
	return fract(sin(p.x*15.38 + p.y*32.19)*45768.23);
}

vec2 hash22(vec2 p) {
	mat2 m = mat2(15.38, 35.11, 71.48, 145.23);
	return fract(sin(m*p)*45768.23);
}

float noise(vec2 p) {
	vec2 g = floor(p);
	vec2 f = fract(p);
	float bl = hash21(g + vec2(0.0, 0.0));
	float br = hash21(g + vec2(1.0, 0.0));
	float tl = hash21(g + vec2(0.0, 1.0));
	float tr = hash21(g + vec2(1.0, 1.0));
	float b = mix(bl, br, f.x);
	float t = mix(tl, tr, f.x);
	float res = mix(b, t, f.y);
	return res;
}

void main( void ) {

	vec2 p = ( gl_FragCoord.xy / resolution.xy );// + mouse / 4.0;
	float c = 0.0;
	c = hash11(p.y)*hash11(p.x);
	c = hash21(p);
	vec2 res = hash22(p);
	c = res.x * res.y;
	c = noise(p*30.0 + time);
	gl_FragColor = vec4( c, c, c, 1.0 );

}