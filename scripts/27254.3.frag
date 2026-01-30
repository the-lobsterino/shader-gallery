#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float num = 24.0;

#define random(S) (fract(sin(dot(S, vec2(12.9898,78.233+0.0001)))* 43758.5453123))

void main(void)
{
	vec2 position = (gl_FragCoord.xy / resolution.xy - 0.5) * vec2(resolution.x / resolution.y, 1.0);
	float c = 1.0;
	for (float i = 0.0; i < num; ++i)
	{
		float a = i / num;
		float t = time*sin(i*num)*0.3+random(vec2(a,a))*i*cos(i);
		float r = smoothstep(a+0.004, a, length(position));
		float seg = r * smoothstep(0.0015, 0.0001, dot(position, vec2(cos(t),sin(t))));
		c = abs(c - seg);
	}
	gl_FragColor = vec4(c);
}