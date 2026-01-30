precision highp float;

uniform vec2 mouse;
uniform vec2 resolution;

vec2 unit_viewport(vec2 coords)
{
	return (coords * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
}

vec3 hue_to_rgb(float H)
{
	H = mod(H, 6.0);
	if(H < 1.0)
		return vec3(1.0, H, 0.0);
	else if(H < 2.0)
		return vec3(2.0 - H, 1.0, 0.0);
	else if(H < 3.0)
		return vec3(0.0, 1.0, H - 2.0);
	else if(H < 4.0)
		return vec3(0.0, 4.0 - H, 1.0);
	else if(H < 5.0)
		return vec3(H - 4.0, 0.0, 1.0);
	else if(H < 6.0)
		return vec3(1.0, 0.0, 6.0 - H);
	return vec3(0.0, 0.0, 0.0);
}

vec3 hsv_to_rgb(float H, float S, float V)
{
	//S = clamp(S, 0.0, 1.0);
	//V = clamp(V, 0.0, 1.0);
	return (1.0 - S) * V * vec3(1.0, 1.0, 1.0) + S * V * hue_to_rgb(H);
}

void main()
{
	vec2 c = unit_viewport(gl_FragCoord.xy) * 1.5;
	
	vec2 z = vec2(0.0, 0.0);
	float maxlen = length(z);
	int numiter = -1;
	for(int i = 0; i < 40; i++)
	{
		// z <- z^2 + c
		z = vec2(z.x * z.x - z.y * z.y, 2.0 * z.x * z.y) + c;
		float len = length(z);
		if(len > 2.0)
		{
			numiter = i;
			break;
		}
		if(len > maxlen)
			maxlen = len;
	}
	vec3 color = numiter != -1 ? hsv_to_rgb(float(numiter) / 5.0, 1.0, 1.0) : hsv_to_rgb(0.0, 0.0, maxlen / 2.0);

	gl_FragColor = vec4(color, 0);

}