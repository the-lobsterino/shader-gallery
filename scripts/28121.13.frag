#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D renderbuffer;


//left top     | barypos(uv)
//left bottom  | barycentric(uv)
//right top    | cartesian(barypos(uv))
//right bottom | cartesian(barycentric(uv))

//transform error tests
//near mouse left  | abs(barycentric-barpos) * 2.^ERROR_MAGNIFICATION_EXPONENT
//near mouse right | uv to bary and back vs uv error * 2.^ERROR_MAGNIFICATION_EXPONENT

#define 	ERROR_MAGNIFICATION_EXPONENT 24.

vec3 barycentric(vec2 uv);
vec2 cartesian(vec3 uvw);	
bool winding(vec3 uvw);
vec3 wind(vec3 uvw);
vec3 unwind(vec3 uvw);

float extract_bit(float n, float b);
float sprite(float n, vec2 p);
float digit(float n, vec2 p);
float print(float n, vec2 position);

#define polar(r,t) (r*vec2(cos(t),sin(t)))

float TRI_SIZE = 8.0;

float tau = atan(1.0) * 8.0;
float pi = atan(1.) * 4.;

vec2 a0 = polar(1.0, 1.0 * tau/12.0);
vec2 a1 = polar(1.0, 3.0 * tau/12.0);
vec2 a2 = polar(1.0, 5.0 * tau/12.0);

vec3 barypos(vec2 uv)
{
	float d0 = dot(uv,a0);
	float d1 = dot(uv,a1);
	float d2 = dot(uv,a2);
	
	return vec3(d0, d1, d2);	
}



vec3 barycentric(vec2 uv)
{	
//	uv.y		/= sqrt(3.);
	uv.y		/= 1.73205080757;
	vec3 uvw	= vec3(uv.y - uv.x, uv.y + uv.x, -(uv.y + uv.y));
//	uvw		*= cos(pi/6.);
	uvw		*= .86602540358;
	return wind(uvw);
}


vec2 cartesian(vec3 uvw)
{
	uvw 		= unwind(uvw);
	uvw.xy		-= uvw.z;
//	uvw.xy		/= sqrt(3.);
	uvw.xy		/= 1.73205080757;	
	
	vec2 uv 	= vec2(uvw.y - uvw.x, uvw.y + uvw.x);		
//	uv.y		*= cos(pi/6.)/1.5;
	uv.y		*= .57735026919;
	return uv;
}

bool winding(vec3 uvw)
{
	return mod(dot(floor(uvw), vec3(1.)), 2.) == 0.;
}


vec3 wind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.zxy : uvw;
}


vec3 unwind(vec3 uvw)
{
	return winding(uvw) ? 1.-uvw.yzx : uvw;
}



void main( void ) 
{
	vec2 uv 	= gl_FragCoord.xy/resolution.xy;
	vec2 panels	= vec2(2., 2.);
	vec2 panel	= floor(uv*panels);

	bool near_mouse	= length(uv*resolution.xy/resolution.yy - mouse*resolution.xy/resolution.yy) < .125;
	
	uv 		= fract(uv*panels);
	
	vec2 aspect	= resolution.xy/resolution.xx;
	float scale	= 8.;
	
	vec3 b		= barycentric(uv * scale * aspect);
	vec2 c		= cartesian(b) / scale / aspect;
	
	vec3 b2		= barypos(uv * scale * aspect);
	vec3 b2t	= wind(b2.zxy * vec3(1.,1.,-1.));
	
	vec2 c2 	= cartesian(b2t) / scale / aspect;	
	
	vec2 c_uv_error	= abs(uv-c) * pow(2., ERROR_MAGNIFICATION_EXPONENT);
	vec2 c2_uv_error	= abs(uv-c2) * pow(2., ERROR_MAGNIFICATION_EXPONENT);
	
	vec3 comparison_error = abs(b-b2t) * pow(2., ERROR_MAGNIFICATION_EXPONENT);
	
	
	vec4 result	= vec4(0.);
	if(!near_mouse)
	{
		if(panel.x == 0.)
		{
			result		= panel.y  == 0. ? vec4( fract(b), 0.) : result;
			result		= panel.y  == 1. ? vec4(fract(b2), 0.) : result;
		}
		if(panel.x == 1.)
		{
			result		= panel.y  == 0. ? vec4( fract(c), 0., 0.) : result;
			result		= panel.y  == 1. ? vec4(fract(c2), 0., 0.) : result;
		}
	}
	else
	{
		if(panel.x == 0.)
		{
			result		= panel.y  == 0. ? vec4(comparison_error, 1.) : result;
			result		= panel.y  == 1. ? vec4(comparison_error, 1.) : result;
		}
		if(panel.x == 1.)
		{
			result		= panel.y  == 0. ? vec4(c2_uv_error, 0., 1.) : result;
			result		= panel.y  == 1. ? vec4(c_uv_error, 0., 1.) : result;
		}
	}
	
	//print xyz buffer values
	vec3 debug_text = vec3(0.);
	vec2 o		= vec2(1.);
	vec4 buffer	= texture2D(renderbuffer, mouse);
	o.x 		*= mouse.x < .5 ?  1. : 0.;
	o.y 		*= mouse.y > .5 ? -1. : 1.;
	
	//print mouse
	debug_text.x 	+= print(mouse.x * 100000., gl_FragCoord.xy - mouse * resolution - vec2(32, 64.) * o);
	debug_text.y 	+= print(mouse.y * 100000., gl_FragCoord.xy - mouse * resolution - vec2(32, 72.) * o);
	
	float mask 	= dot(debug_text, vec3(1.));
	debug_text 	+= mask * .5;
	
	
	gl_FragColor = result - vec4(debug_text, 0.);
}//sphinx

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


float print(float n, vec2 position)
{	
	float offset	= 4.;
	
	float result	= 0.;
	for(int i = 0; i < 24; i++)
	{
		float place	= pow(10., float(i));
		if(n > place || float(i) == 0.)
		{
			result	 	+= digit(n/place, position + vec2(8., 0.));
			position.x 	+= offset;
		}
		else
		{
			break;
		}
		
	}
	return result;
}


