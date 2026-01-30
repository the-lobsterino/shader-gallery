#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform sampler2D buffer;
uniform vec2 resolution;

vec2 neighbor_offset(float i)
{
	float c = abs(i-2.);
	float s = abs(i-4.);
	return vec2(c > 1. ? c > 2. ? 1. : .0 : -1., s > 1. ? s > 2. ? -1. : .0 : 1.);
}

void main( void ) {

	vec2 uv			= gl_FragCoord.xy/resolution.xy;
	vec2 aspect 		= resolution/min(resolution.x, resolution.y);
	float mouse_distance	= length(uv*aspect-mouse*aspect);
	vec4 prior		= texture2D(buffer, uv);
	vec4 dx 		= dFdx(prior);
	vec4 dy 		= dFdy(prior);
	
	vec4 result		= vec4(0.,0.,0.,0.);
	
	result = fract(result);
	for(float i = 0.; i < 8.; i++)
	{
		vec2 neighbor_address	= gl_FragCoord.xy + neighbor_offset(i) * (1.+prior.w + clamp(.01/mouse_distance, 0., 2.));
		neighbor_address	= mod(neighbor_address, resolution);
		neighbor_address	/= resolution;
		
		vec4 neighbor		= texture2D(buffer, neighbor_address);
		
		result			+= neighbor/8.;
	}
	
	
	float v 		= abs(prior.w-prior.x);
	if(dx.w > dy.w)
	{
		result -= prior.wxyz;
	}
	else if(dx.x < dy.x)
	{
		result += prior.yzwx;
	}
	
	result			+= fract(result.xzyw * .5 - uv.x);
	result			*= .5;
	result			= mix(result, prior, .5);
	float clear_buffer		= mouse.x+mouse.y > .02 || fract(time / 128. * 60.) < 1./256. ? 1. : 0.;
	result				*= clear_buffer;
	
	result 			+= float(floor(gl_FragCoord.x - mouse.x * resolution.x) == 0. && floor(gl_FragCoord.y - mouse.y * resolution.y) == 0.);
	gl_FragColor = result;

}