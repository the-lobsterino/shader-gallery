uniform lowp vec2 resolution;
uniform lowp float time;

const lowp vec2 dir = vec2(0.1, 0.2);
const lowp vec2 size = vec2(64.0, 64.0);
const lowp float pi = 3.1415;

void main()
{
		lowp vec2 position = (gl_FragCoord.xy / size) + (time * dir);
		lowp float v = time + position.x * 10.0;

		lowp vec4 color = vec4(0.0);
		color.r = sin(v) * 0.5 + 0.5;
		color.g = sin(v + pi * 0.5) * 0.5 + 0.5;
		color.b = sin(v + pi) * 0.5 + 0.5;
		color.a = 1.0;

		gl_FragColor = color;
}
