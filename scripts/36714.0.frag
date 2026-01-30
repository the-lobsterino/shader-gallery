precision mediump float;
uniform float time;
uniform vec2 resolution;

uniform sampler2D backbuffer;

void main(void) {
	vec2 position = (gl_FragCoord.xy / resolution.xy) + vec2(0.1);

	gl_FragColor = vec4(
		vec3(tan(position.x * 100000.0 + fract(position.y) + time) * fract(position.y * position.x)) * 
		vec3(sin(time + position.x + position.y), sin(time + 2.04 + position.y + position.x), sin(time + 4.08 + position.y + position.x))
		+ texture2D(backbuffer, position - vec2(0.1)).xyz
		, 1.0);
}