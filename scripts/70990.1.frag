#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

vec3 hsv(float hue) {
	return clamp(abs(fract(hue+vec3(0,2,1)/3.)*6.-3.)-1.,0.,1.);
}

void main( void ) {
	vec2 pos = (gl_FragCoord.xy / resolution - 0.5) * 2.0;
	vec2 uv = (pos * 1.02) * 0.5 + 0.5;

	vec3 color = texture2D(backbuffer, uv).rgb;
	color -= 1.0 / 256.0;

	const float eps = 0.02;
	float t = time;
	float a = sin(t);
	if (distance(pos, vec2(a, 1)) < eps) {
		color = hsv(t * 0.2);
	}
	if (distance(pos, vec2(1, -a)) < eps) {
		color = hsv(t * 0.2 + 0.5);
	}
	if (distance(pos, vec2(-a, -1)) < eps) {
		color = hsv(t * 0.2 + 0.25);
	}
	if (distance(pos, vec2(-1, a)) < eps) {
		color = hsv(t * 0.2 + 0.75);
	}

	gl_FragColor = vec4(color, 1);
}
