






























































#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void)
{
	vec2 p = (gl_FragCoord.xy - resolution / 2.0) / resolution.x;
	float r = length(p);
	float a = atan(p.y + p.x * 4.0, p.x);
	if(r > 0.2)
		gl_FragColor = vec4(0.9, 0.5, 1, 1) * float(sin(a * 4.0 + r * 300.0 - time * 20.0) > 0.0);
	else if(r > 0.1)
		gl_FragColor = vec4(0.8, 0.6, 1, 1) * float(sin(a * 2.0 - r * 350.0 - time * 17.0) > 0.0);
	else
		gl_FragColor = vec4(0.9, 0.7, 1, 1) * float(tan(a * 1.0 + r * 400.0 + time * 15.0) > 0.0);
}