#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float scale = 4.0;
	vec2 position = (gl_FragCoord.xy / resolution.xy - vec2(0.5, 0.5)) * scale;
	const int max = 64;
	float radius = 3.0;
	//vec2 c = (mouse * 2.0 - vec2(1.0, 1.0));
	float t = time / 100.0;
	vec2 c = 0.6 * vec2(sin(5.0 * t + 0.78539816339), cos(4.0 * t));
	vec2 z = position;
	
	int imax = 0;
	float minr = 1.0;
	for (int i = 0; i < max; i++)
	{
		imax = i;
		float ri = length(z);
		minr = min(ri, minr);
		if (ri > radius)
		{
			break;
		}
		z = vec2( z.x*z.x - z.y*z.y, 2.0*z.x*z.y ) + c;
	}
	float r = float(imax) / float(max);
	if (imax == max - 1)
	{
		r = (1.0 - 3.0 * minr);
	}

	if (r < 0.25)
	{
		gl_FragColor = mix(vec4(0.0, 0.0, 0.0, 1.0), vec4(0.0, 0.0, 1.0, 1.0), 4.0 * r);
	}
	else if (r < 0.5)
	{
		gl_FragColor = mix(vec4(0.0, 0.0, 1.0, 1.0), vec4(1.0, 1.0, 1.0, 1.0), 4.0 * (r - 0.25));
	}
	else if (r < 0.75)
	{
		gl_FragColor = mix(vec4(1.0, 1.0, 1.0, 1.0), vec4(1.0, 1.0, 0.0, 1.0), 4.0 * (r - 0.5));
	}
	else
	{
		gl_FragColor = mix(vec4(1.0, 1.0, 0.0, 1.0), vec4(0.0, 0.0, 0.0, 1.0), 4.0 * (r - 0.75));
	}

}