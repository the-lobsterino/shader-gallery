#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float pi = 3.14159265;

vec2 polarform(vec2 position, bool positive)
	{
	vec2 polarpos;
	polarpos.x = sqrt(position.x*position.x + position.y*position.y);
	if (position.x > 0.)
		{
		polarpos.y = atan(position.y/position.x);
		}
	else if (position.x < 0.)
		{
		polarpos.y = atan(position.y/position.x) + pi;
		}
	else if (position.y > 0.)
		{
		polarpos.y = pi/2.;
		}
	else if (position.y < 0.)
		{
		polarpos.y = pi * 3./2.;
		}
	else
		{
		polarpos.y = 0.;
		}
	if (positive)
		{
		polarpos.y = polarpos.y + pi/2.;
		}
		polarpos.y = mod(polarpos.y-pi/2.,2.*pi);
	return polarpos;
	}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5)*2.0;
	position.x = position.x * resolution.x/resolution.y;
	vec3 color = vec3(0.0,0.0,0.0);
	vec2 polarpos = polarform(position,true);
	//if (polarpos.y < 0.0)
	if (mod(6.0*(polarpos.x + polarpos.y) + time,pi) < 0.1/polarpos.x)
	{
	color = 0.5 + 0.5*sin(30.*polarpos.x + pi*(1./2. + time*vec3(1.2,1.4,1.5)))*sin(time*vec3(2.0,3.0,4.0)/pi);
	}
	gl_FragColor = vec4( color, 1 );

}