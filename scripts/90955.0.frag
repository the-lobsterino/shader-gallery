#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float random(float seed)
{
	return fract(sin(seed)*1e4);
}


float row(float x, float y, float
	 
	 row_idx)
{
	float rand_factor = 0.25+random(row_idx)*0.75;
	return step(0.2, y) * step(y, 0.8) * step(0.5, random(floor(x*rand_factor*2. + 15.*time*random(rand_factor))));
}

void main()
{
	vec2 uv = gl_FragCoord.xy / resolution.y;
	uv.x *= 10.0;
	uv.y *= 35.0;
	
	float c = row(uv.x, fract(uv.y), floor(uv.y));
	
	gl_FragColor = vec4(c);
}