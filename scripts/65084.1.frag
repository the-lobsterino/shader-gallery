#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
	
vec2 ComplexMultiply(vec2 z1, vec2 z2)
{
	vec2 w;
	w.x = z1.x*z2.x - z1.y*z2.y;
	w.y = z1.y*z2.x + z1.x*z2.y;
	return w;
}

void main( void ) {

	vec2 pos = (gl_FragCoord.xy * 2.0 - resolution) / max(resolution.x, resolution.y);
	const float scale = 2.5;
	vec4 color = vec4(0.0, 0.0, 0.0, 0);
	vec2 c, z;
	
	c.x = pos.x*scale;
	c.y = pos.y*scale;
	z.x = 0.0;
	z.y = 0.0;
	
	for (int i = 0; i < 64; i++)
	{
		vec2 w;
		w = ComplexMultiply(z, z) + c;
		if (length(w) > 2.0)
		{
                	color = vec4(w.x, w.y, 1.0, 0);
                	break;
		}
		else
		{
			z = w;
		}
	}
	
	gl_FragColor = color;

}