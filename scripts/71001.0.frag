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
	float r = length(1.0 / resolution);
	vec2 uv = gl_FragCoord.xy / resolution;

	float t = time;
	float a = (gl_FragCoord.x + gl_FragCoord.y) * .01 + t * 2.;
	vec2 p = vec2(cos(a), sin(a)) * r * 1.0;
	vec3 color = texture2D(backbuffer, uv + p).rgb;
//	color -= 1.0 / 256.0;

	if (length(uv - 0.5) < r) {
		color = hsv(t / 6.0);
	}

	gl_FragColor = vec4(color, 1);
}
