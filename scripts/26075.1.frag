#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float witch(float x)
{
	return 1./(x*x+1.);
}

float witch(float x, float a)
{
	float w = (8.*pow(a, 3.))/(x*x+4.*a*a);
	return w;
}

float contour(float x, float y, float w)
{
    w *= .5;
    return float(x-w<y^^x+w<y); 
}

vec2 format( vec2 uv )
{
    uv       = uv * 2. - 1.;
    uv.x     *= resolution.x/resolution.y;
    return uv;
}
#define Pi 3.1415926
vec2 fromPolar( vec2 uv ) //from?
{
	float l = uv.y;
	float a = uv.x * Pi;
	uv = vec2( sin( a ), cos( a ) );
	
	return uv * l;
}

vec2 toPolar( vec2 uv ) //to?
{
	float a = atan( uv.y, uv.x );
	float l = length( uv );
	
	uv.x = a / Pi;
	uv.y = l;
	
	return uv;
}

void main( void ) {

	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	uv 		= format(uv);
	uv = toPolar( uv );
	
	uv *= 2.;

	float x 	= uv.x;
	float y 	= uv.y - 0.5;

	
	x		= witch(x, mouse.x * .5);
	
	x 		= contour(x, y, .01);

	gl_FragColor 	= vec4(x);
}