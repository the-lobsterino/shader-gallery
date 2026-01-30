#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


#define RESOLUTION_MAX max(resolution.x, resolution.y)

#ifdef GL_ES
precision mediump float;
#endif


float torus(vec2 position, vec2 radius)
{
	return abs(abs(length(position)-radius.x)-radius.y);
}


float contour(float x)
{
	return 1.-clamp(x * max(resolution.x, resolution.y)/2., 0., 1.);
}


float circle(vec2 position, float radius)
{
	return contour(torus(position, vec2(radius,0.)));
}


vec2 project(vec2 position, vec2 a, vec2 b)
{
	vec2 q	 	= b - a;	
	float u 	= dot(position - a, q)/dot(q, q);
	u 		= clamp(u, 0., 1.);
	return mix(a, b, u);
}


float segment(vec2 position, vec2 a, vec2 b)
{
	return distance(position, project(position, a, b));
}


float line(vec2 p, vec2 a, vec2 b)
{
	return contour(segment(p, a, b));
}


mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}

void main( void ) {

	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 p		= (uv-.5) * (resolution.xy/min(resolution.x, resolution.y));

	float radius  	= mouse.x;
	const float divisions	= 9.;
	
	float result 	= 0.0;

	float rad	= atan(1.);
	for(float i = 0.; i < divisions; i++)
	{
		result 	= max(result, line(p, vec2(0., .0), vec2(0., -.5)*rmat(i*(8.*rad/divisions))));		
	}
	result 		+= circle(p, .5);
	
	gl_FragColor 	= vec4(result);

}