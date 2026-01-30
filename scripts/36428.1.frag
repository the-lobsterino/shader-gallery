#ifdef GL_ES
precision mediump float;
#endif
					
#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define TAU (8.*atan(1.))

float line(vec2 p, vec2 a, vec2 b, float w)
{
	if(a==b)return(0.);
	float d = distance(a, b);
	vec2  n = normalize(b - a);
   	vec2  l = vec2(0.);
	l.x = max(abs(dot(p - a, n.yx * vec2(-1.0, 1.0))), 0.0);
	l.y = max(abs(dot(p - a, n) - d * 0.5) - d * 0.5, 0.0);
	
	return smoothstep(w, 0., length(l));
}

mat2 rmat(float t)
{
	float c = cos(t);
	float s = sin(t);
	return mat2(c, s, -s, c);
}


float extract_bit(float n, float b)
{
	n = floor(n);
	b = floor(b);
	b = floor(n/pow(2.,b));
	return float(mod(b,2.) == 1.);
}

float sprite(float n, vec2 p)
{
	p = floor(p);
	float bounds = float(all(lessThan(p, vec2(3., 5.))) && all(greaterThanEqual(p,vec2(0,0))));
	return extract_bit(n, (2. - p.x) + 3. * p.y) * bounds;
}

float digit(float n, vec2 p)
{
	n = mod(floor(n), 10.0);
	if(n == 0.) return sprite(31599., p);
	else if(n == 1.) return sprite( 9362., p);
	else if(n == 2.) return sprite(29671., p);
	else if(n == 3.) return sprite(29391., p);
	else if(n == 4.) return sprite(23497., p);
	else if(n == 5.) return sprite(31183., p);
	else if(n == 6.) return sprite(31215., p);
	else if(n == 7.) return sprite(29257., p);
	else if(n == 8.) return sprite(31727., p);
	else if(n == 9.) return sprite(31695., p);
	else return 0.0;
}

float print_index(float index, vec2 position)
{	
	float offset = 4.;
	float result = 0.;
	for(int i = 0; i < 8; i++)
	{
		float place = pow(10., float(i));
		if(index > place || float(i) == 0.)
		{
			result += digit(index/place, position + vec2(8., 0.));
			position.x += offset;
		}
		else break;
		
	}
	return result;
}

vec3 hsv(float h,float s,float v)
{
	return mix(vec3(1.),clamp((abs(fract(h+vec3(3.,2.,1.)/3.)*6.-3.)-1.),0.,1.),s)*v;
}

void main( void ) {

	vec2 uv		= gl_FragCoord.xy/resolution.xy;
	vec2 aspect	= resolution/min(resolution.x, resolution.y);
	vec2 position	= (uv*2.-1.)*aspect;
	vec2 index	= floor(position * 2.-1.);
	position 	= fract(position*2.)*2.-1.;
	float width	= 12./max(resolution.x, resolution.y);

	

	float r		= floor(mouse.x*128.+index.x);
	float q		= floor(mouse.y*128.+index.y);
	
	mat2 rotation;
	vec2 a		= vec2(0., 1.);
	vec2 b		= vec2(0., 1.);
	vec2 c		= vec2(0., 1.);
	vec2 d		= vec2(0., 1.);
	
	mat2 rotation_r	= rmat(r/TAU);
	mat2 rotation_q	= rmat(q/TAU);

	vec2 print_pos	= floor(mod(gl_FragCoord.xy, vec2(resolution.x/8., resolution.y/4.)));
	float print	= print_index(r, print_pos-vec2(16., 2.)) + print_index(q, print_pos-vec2(32., 2.));	
	
	vec4 result	= vec4(0.);
	result		+= print;
	float l		= 0.;
	for(float i = 0.; i < 256.; i++)
	{
		result.xyz	+= line(position, a, b, width)*hsv(fract(l),1.,1.)*.5;
		a 		*= rotation_r;		
		b 		*= rotation_q;
		l 		+= dot(a,b);
	}
	
	result.x 	*= .6;
	result.y 	*= .84;
	result.z 	*= .94;
	
	gl_FragColor	= result;
}//sphinx