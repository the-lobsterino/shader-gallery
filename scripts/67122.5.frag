#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
uniform sampler2D s;

void main( void ) {
	vec2 p = (gl_FragCoord.xy - resolution * 0.5) / max(resolution.x, resolution.y) * 8.0;
	vec2 uv = gl_FragCoord.xy / resolution.xy;
	vec4 x = texture2D(s, uv);
	float r, g, b;
	for (int i = 0; i < 15; i++) {
		r = fract(cos(.0125 + time * .35) + sin(p.x + g)) * .65;
		g = fract(sin(.0125 + time * .35) + cos(p.y + r)) * .65;
		b = 0.15 + fract(1. - (r + g) + time * .45);
	}
	vec4 color = vec4(r, g, b, 1.0);
	x -= 0.01;
	gl_FragColor = color + x * .45 - sin(cos(x) * .15) * .75;
}

