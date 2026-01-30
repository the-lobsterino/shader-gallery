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
	float pulses = pow(sin(time * 9.) * 0.5 + 0.5, 10.0) / 200.0 + 0.0001;
	//float pulses = 1./mod(time*4.5, 3.) * 0.0005 + 0.001;
	vec2 unit = vec2(cos(t), sin(t));
	vec2 position = (gl_FragCoord.xy / resolution);
	float f = pulses / abs(dot(position - vec2(0.5) * 2. * mouse, unit));
	f += pulses / abs(dot(position - vec2(0.5) * 2. * mouse, vec2(unit.y, -unit.x)));
	f += length(texture2D(buf, (position - vec2(0.5)) * 0.95 + vec2(0.5)).rgb) * 1.1;
	gl_FragColor = vec4(f * 0.2, f * 0.5, f * 0.7, 1.0);
}