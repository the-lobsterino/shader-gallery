#extension GL_OES_standard_derivatives : enable

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

//z order study

float line(vec2 p, vec2 a, vec2 b) 
{
	vec2 ap = a - p;
	vec2 ab = a - b;
	return smoothstep(2./min(resolution.x, resolution.y), 0., length(ap - ab * clamp(dot(ap, ab) / dot(ab, ab), 0., 1.)));
}

float circle(vec2 p, float r) 
{
	return smoothstep(2./min(resolution.x, resolution.y), 0., abs(length(p)-r));
}

vec2 z_order(float z)
{
	vec2 p 		= vec2(0.,0.);
	vec2 u 		= vec2(1., 0.);
	for(float i = 0.; i < 11.; i++)
	{				
		p 	+= step(.5, fract(z * pow(2., -i))) * u * pow(2., i/2.);
		u 	= u.yx;
	}
	
	p		= p * vec2(1., sqrt(2.)) * .5 + .5;
	
	return p;	
}

void main( void ) 
{
	vec2 uv 		= gl_FragCoord.xy/resolution.xy;
	vec2 aspect		= resolution.xy/min(resolution.x, resolution.y);
	vec2 position		= (uv-.5) * aspect;
	float color 		= 0.;
	
	const float count 	= 1024.;

	float scale 		= 1./sqrt(count);
	vec2 vertex		= vec2(0., 0.);
	vec2 prior		= vec2(0., 0.);
	for(float i = 0.; i < count; i++)
	{
		if(i < mod(time*64., count))
		{
			vertex	= z_order(i);
			vertex	= vertex* scale - .5;
			prior   = i == 0. ? vertex : prior;
			color 	= max(color, line(position, prior, vertex));
			//color 	= max(color, circle(position-vertex, .0125));			
			prior	= vertex;
		}
	}
	
	
	gl_FragColor 		= color + vec4(0., 0., 0., 1.);
}//sphinx