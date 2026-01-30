#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


mat2 rmat(in float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

float minkowski(vec2 a, vec2 b, float p) 
{
	return pow(pow(abs(a.x - b.x),p) + pow(abs(a.y - b.y),p),1./p);
}

float hash(vec2 uv)
{
    return fract(cos(uv.x+sin(uv.y))*12345.6789);
}

vec2 neighbor_offset(float i)
{
	return vec2(floor(i/3.), mod(i, 3.))-1.;
}

float voronoi (vec2 p, float d) 
{
	vec2 g 		= floor(p);
	vec2 f 		= fract(p);
	float res 	= 1.;
	vec2 bb 		= vec2(0.);
	for(int i = 0; i < 9; i++) 
	{
		vec2 b 	= neighbor_offset(float(i));
		float h = minkowski(hash(g+b)+b, f, d*4.);

		res 	= min(res, h);
	}
	return res;
}

float map(vec2 position)
{
	float v 	= 0.;
	float f 	= .9;
	float a 	= .25;
	for(int i = 0; i < 12; i++)
	{
		v 		+= voronoi(v + position * f, mouse.x) * a;
		f 		*= -2.;
		a 		*= .895;
		position 	= position.yx;
	}
	
	return v;
}

void main( void ) 
{
	vec2 aspect	= resolution/min(resolution.x, resolution.y);
	vec2 uv		= gl_FragCoord.xy/resolution;
	
	float field	= map(.1*(uv-.5)*aspect);
	field		= abs(1.-field);

	gl_FragColor 	= vec4(field);
}