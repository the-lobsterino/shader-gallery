#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

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

mat2 rotate(float a) {
	float c = cos(a);
	float s = sin(a);
	return mat2(c, s, -s, c);
}

vec3 layer(vec2 uv) {
	vec3 col = vec3(0.);
	for (int i = 0; i < 20; i++) {
		vec2 p = 2. * hash2(float(i) + vec2(2.)) - 1.;
		p -= vec2(sin(.1 * hash(float(i) + vec2(10., 50.)) * time + hash(float(i) + vec2(10.))), 
			  cos(.1 * hash(float(i) + vec2(20., 40.)) * time + hash(float(i) + vec2(10.))));
		float k = (.5 * hash(float(i) + vec2(25., 75.)) + .01);
		col += palette(k * 3., vec3(.5), vec3(.5), vec3(1.), vec3(.0, .33, .67)) / length(uv - p);
	}
	col /= 120.;
	return col;
}

void main() {
	vec2 uv = (2. * gl_FragCoord.xy - resolution) / resolution.y;
	vec2 st = gl_FragCoord.xy / resolution;
	vec3 col = vec3(0.);
	for (float i = 0.; i < 1.; i += .1) {
		uv *= rotate(time * .2 + i);
		float t = fract(time * .1 + i);
		float s = smoothstep(2., 0., t);
		float f = smoothstep(1., 0., t)
		 * smoothstep(.0, .2, t);
		col += layer(uv * s) * f;
	}
	vec3 bb = texture2D(backbuffer, st + .0008).rgb;
	gl_FragColor = vec4(col * .2 + bb * .9, 1.);
}