precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;

float distance(vec2 st)
{
	float len = distance( st, vec2(0.0, 0.0));

	float ri = abs(0.7 - len);

	float d = 0.03 / ri;

	return  d;
}

void main() {
	vec2 uv = (gl_FragCoord.xy * 5.0 - resolution.xy) / min(resolution.x, resolution.y) - (mouse*5.0);

	float d = distance(uv);

	gl_FragColor = vec4(vec2(d) * (sin(time * 2.7) * 0.3 + 0.4), d * (sin(time * 3.9) * 0.5 + 0.5),1.0);
}
