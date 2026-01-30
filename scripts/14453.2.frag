#ifdef GL_ES
precision mediump float;
#endif

// make sure to select 1x ^
// --mniip

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float dith(vec2 p)
{
	return
		+ (mod((p.x + p.y), 2.0) >= 1.0 ? 1.0 / 2.0 : 0.0)
		+ (mod(p.x, 2.0) >= 1.0 ? 1.0 / 4.0 : 0.0)
		+ (mod(p.x + p.y, 4.0) >= 2.0 ? 1.0 / 8.0 : 0.0)
		+ (mod(p.x, 4.0) >= 2.0 ? 1.0 / 16.0 : 0.0)
		+ (mod(p.x + p.y, 8.0) >= 4.0 ? 1.0 / 32.0 : 0.0)
		+ (mod(p.x, 8.0) >= 4.0 ? 1.0 / 64.0 : 0.0)
		+ 1.0 / 128.0;
}

vec3 hue(float h, vec2 c)
{
	h = mod(h, 6.0);
	if(h > 5.0)
		return dith(c) > h - 5.0 ? vec3(1, 0, 1) : vec3(1, 0, 0);
	if(h > 4.0)
		return dith(c) > h - 4.0 ? vec3(0, 0, 1) : vec3(1, 0, 1);
	if(h > 3.0)
		return dith(c) > h - 3.0 ? vec3(0, 1, 1) : vec3(0, 0, 1);
	if(h > 2.0)
		return dith(c) > h - 2.0 ? vec3(0, 1, 0) : vec3(0, 1, 1);
	if(h > 1.0)
		return dith(c) > h - 1.0 ? vec3(1, 1, 0) : vec3(0, 1, 0);
	return dith(c) > h ? vec3(1, 0, 0) : vec3(1, 1, 0);
}

void main()
{
	vec3 color = vec3(0, 0, 0);
	vec2 p = gl_FragCoord.xy / resolution * 4.0 - 2.0;
	vec2 m = mouse * 4.0 - 2.0;
	vec2 z = p;
	float h = time / 4.0;
	for(int i = 0; i < 60; i++)
	{
		if(length(z) > 2.0)
		{
			color = hue(h, gl_FragCoord.xy);
			break;
		}
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + m;
		h += 0.12;
	}
	if(length(color) == 0.0)
	{
		color = dith(gl_FragCoord.xy) >= sin(time + length(z) * 100.0) / 2.0 + 0.5 ? vec3(1, 1, 1) : vec3(0, 0, 0);
	}
	gl_FragColor = vec4(color, 1);//vec4(hue(h, gl_FragCoord.xy), 1);
}