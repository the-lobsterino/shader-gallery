#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;

// http://www.nrc.gov/reading-rm/doc-collections/cfr/part020/part020-1901.html

// You spin me right round, baby right round...

void main(void)
{
	float pi = atan(-1.0) * 4.0;
	vec2 uv = (gl_FragCoord.xy / resolution - mouse) * vec2(resolution.x / resolution.y, 1.0) * 1.05;
	float c = 0.0;
	float r = length(uv);
	for (int i = 0; i < 3; ++i)
	{
		float b = (float(i) + 0.5) * pi / 3.0;
		vec2 a = vec2(cos(b-time), sin(b-time));
		c = abs(c - smoothstep(0.0, 0.005, clamp(dot(uv, a), 0.0, 0.005)));
	}
	c *= smoothstep(0.145, 0.15, r) - smoothstep(0.495, 0.5, r);
	c += 1.0 - smoothstep(0.095, 0.1, r);
	c = 1.0 - c; //un-reverse
	gl_FragColor = vec4(c, c * 0.9, 0.0, 1.0);
}