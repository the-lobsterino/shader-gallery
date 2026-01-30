#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(vec2 uv) {
	return fract(74455.45 * sin(dot(vec2(78.54, 14.45), uv)));
}

vec2 hash2(vec2 uv) {
	float  k = hash(uv);
	return vec2(k, hash(uv + k));
}

// IQ
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d)
{
    return a + b*cos( 6.28318*(c*t+d) );
}
//

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec3 col = vec3(0.);
	for (int i = 0; i < 120; i++) {
		vec2 p = 2. * hash2(float(i) + vec2(2.)) - 1.;
		p -= vec2(sin(.1 * hash(float(i) + vec2(10., 50.)) * time + hash(float(i) + vec2(10.))), 
			  cos(.1 * hash(float(i) + vec2(20., 40.)) * time + hash(float(i) + vec2(10.))));
		float k = (.5 * hash(float(i) + vec2(25., 75.)) + .01);
		col += palette(k * 3., vec3(.5), vec3(.5), vec3(1.), vec3(.0, .33, .67)) / length(uv - p*p*p*p*sin(time/2.0));
		
		
	}
	col /= 360.;
	gl_FragColor = vec4(col, 1.);
}