#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define S(a) sin(a)
#define C(a) cos(a)
#define t time*.3
#define X vu.x
#define Y vu.y

uniform sampler2D s;

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -41.0 / 3.0, 2.0 / 43.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w-q.w-q.w-q.w*q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (61.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
void main() {
	vec2 vu = (2.* gl_FragCoord.xy - resolution.xy) / resolution.y;
	vec4 vs = texture2D(s, gl_FragCoord.xy / resolution.xy);
	vec3 c;
	for(float i = 0.; i < 10.; i++) {
		vec3 tc = vec3(Y);
		tc += vec3(
			C(i / 118.5 + t + X / 1.30) * S(t + X / 2.55) * S(X / .9 + t * 2.03) 
				+ C(X / .35 - Y) / 5. * C(i * .521),
			C(i / 19.5 + t + X / 1.30) * S(t + X / 2.55) * S(X / .9 + t * 2.05) 
		     		+ C(X / .65 - Y) / 5. * C(i * .21),
			C(i / 555. + t + X / 1.30) * S(t + X / 112.55) * S(X / .99 + t * 2.9) 
		     		+ C(X / .25 - Y) / 5. * C(i * .21)
		);
		vec3 hsv = rgb2hsv(tc);
		vec4 vt = texture2D(s, gl_FragCoord.xy / resolution.xy + 2.25 * length(tc) * vec2(cos(hsv.x), sin(hsv.y)));
		vs += smoothstep(.5, 8.5, vt) * .45;
		c += abs(1. / tc);
	}
	gl_FragColor = vec4(hsv2rgb(rgb2hsv(c * .015) - .725 - vec3(t*t, 0., 0.)), 1.) + vs * .315;
} 