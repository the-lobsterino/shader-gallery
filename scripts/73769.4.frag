#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

float pi = 3.141592653;
uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = 8.*(( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position.x = position.x*resolution.x/resolution.y;

	
	position = position*position;
	position = position*5.0;

	position = position + time*1.5;
	
	position = position - mod(position,resolution.x/512.);

	vec3 color = vec3(0.0,0.0,0.0);
	float colcheck = abs(sin(position.x * pi) + sin(position.y * pi));
	
	if (colcheck < (0.5 + 0.5*sin(0.1 + 2.*(time + 0.45))) && colcheck < (0.2 + 0.5*sin(2. + 3.*(time + 0.65))))
	{
	color = 0.6 + 0.5*sin(vec3(0.1,0.2,0.3) * 10.*time/(2.*pi));
	}
	else if (colcheck < (0.5 + 0.5*sin(0.7 + 2.*(time + 0.45))) && colcheck < (0.1 + 0.5*sin(2. + 3.*(time + 0.65))))
	{
	position = position + time*0.2;
	color = vec3(0.2,0.5,0.4) * (0.5 + 0.5*sin(vec3(0.8,0.2,0.3) * 10.*time/(2.*pi)));
	}
	else if (colcheck < (0.5 + 0.5*sin(0.3 + 2.*(time + 0.45))) && colcheck < (0.6 + 0.5*sin(2. + 3.*(time + 0.65))))
	{
	position = position + time*(0.4);
	color = 0.6 + 0.5*sin(vec3(0.4,1.5,0.2) * 10.*time/(2.*pi));
	}
	gl_FragColor = vec4( color, 1.0 );

}