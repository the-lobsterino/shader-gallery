// seizure warning: you have 5 seconds to get away
















































#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D buf;

void main(void)
{
	float t = time * 0.1;
	mat2 rotor = mat2(cos(t), -sin(t), sin(t), cos(t));
	vec2 position = (gl_FragCoord.xy / resolution);
	vec2 v = vec2(0.002) / (rotor * (position - mouse));
	float f = dot(v, v);
	f += pow(length(texture2D(buf, (position - vec2(0.5)) * 0.95 + vec2(0.5)).rgb), -1.25);
	gl_FragColor = (time < 5.) ? vec4(0.0) : vec4(f * 0.2, f * 0.5, f * 0.7, 1.0);
}