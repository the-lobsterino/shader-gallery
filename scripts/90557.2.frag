#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define rot(a) mat2(cos(a), -sin(a), sin(a), cos(a))

vec3 hsv2rgb(vec3 c) {
	vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
	vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
	return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float star(vec2 pos, float ra)
{
	pos *= rot(time * ra);
	float a = atan(pos.y, pos.x);
	return 0.5 + sin(a * 5.0) * 0.08 - length(pos);
}

void main()
{
	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec3 color = vec3(0.0);
	float shape = 0.0;

	const int num = 40;
	for (int i = 0; i < num; i++)
	{
		float siz = sin(float(i)*12.74) * 0.5 + 1.5;
		vec2 p = pos * siz - vec2(sin(float(i) * 911.87) * 2.5, cos(float(i) * 11.65) * 1.5);
		vec3 c = hsv2rgb(vec3(float(i) / float(num), 1.0, 1.0)) * (1.2 - length(p));
		float s = smoothstep(0.0, 0.05, star(p, sin(float(i))));
		//color += s * c;
		color = max(color, c);
		shape += s;

	}
	
	vec3 bgc = vec3(0.7, 1.0, 0.8) * (1.0 - 0.25 * length(pos));
	color = mix(bgc, color, shape);

	gl_FragColor = vec4(color, 1.0);
}