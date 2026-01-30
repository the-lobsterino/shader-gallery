// co3moz
precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D b;

#define b(m, n) texture2D(b, p / a + vec2(m, n)).xyz + texture2D(b, p / a + vec2(-m, -n)).xyz
#define t time

void main(void) {
	vec2 a = resolution.xy / min(resolution.x, resolution.y);
	vec2 p = (gl_FragCoord.xy / resolution.xy) * a;
	gl_FragColor = (distance(p, vec2(.5) * a + vec2(sin(t - sin(t) * cos(t)), cos(t + sin(t) * cos(t))) / 5.) < .1) ? (vec4(p * sin(p * 5000.), cos(p * 10.))) : (t < 1. ? vec4(0.) :  vec4(b(.1, .1) + b(.1, -.1), 1.) * .225);
}