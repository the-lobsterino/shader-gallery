#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float hash(vec2 uv)
{
    return fract(cos(uv.x+sin(uv.y))*12345.67899);
}

vec2 neighbor_offset(float i)
{
	float x = floor(i/3.);
	float y = mod(i, 3.);
	return vec2(x,y)-1.;
}

float voronoi (vec2 p) 
{
	vec2 g = floor(p);
	vec2 f = fract(p);
	float res = 1.;
	vec2 bb = vec2(0.);
	
	for(int i = 0; i < 9; i++) 
	{
		vec2 b 	= neighbor_offset(float(i));
		float h = distance(hash(g+b)+b, f);
		res 	= min(res, h);
	}
	return res;
}

void main( void ) 
{
	vec2 uv		= gl_FragCoord.xy/resolution.xy;
	uv 		*= resolution.xy/resolution.yy;
	uv 		+= 32.*(mouse-.5);
	uv 		*= 5.;
		
	float v 	= 0.;
	
	float f 	= .33;
	float a 	= .33;
	for(int i = 0; i < 8; i++)
	{
		v += voronoi(v + uv * f) * a;

		f *= 2.;
		a *= .5;
	}
	
	v = abs(.5-v);
	
	gl_FragColor = vec4(v);
}//sphinx