precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;

vec3 hue(float h)
{
	return clamp(abs(fract(h+vec3(1.,1./3.,2./3.))*6.-3.)-1.,0.,1.);
}

void main()
{
	vec2 p = (2.*gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y);
	p = (p-vec2(4.,1.))/4.;
	vec3 color = vec3(0.);
	vec2 c = vec2(0.);
	const float count = 256.;
	float stepratio = 1.;
	for (float i=0.; i<count; i++)
	{
		c = vec2(c.x*c.x-c.y*c.y, 2.*c.x*c.y) + p;
		if (length(c) > 4.)
		{
			stepratio = i/count;
			break;
		}
	}
	color = hue(stepratio*10.);
	gl_FragColor = vec4(color, 1.);
}