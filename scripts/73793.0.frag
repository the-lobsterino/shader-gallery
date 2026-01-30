#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
float pi = 3.14159265;

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) - 0.9;
		position = position*35.0;
	position.x = position.x * resolution.x/resolution.y;
	//position = position*position;
	position.y = cos(position.y);
	vec3 color = vec3(0.5,1.1,0.0);
/*	if (abs((position.x*position.y) - 4.0*(sin(position.x + time) + cos(position.y+time))) < 0.5 )
	{
		color =  color + 0.5 + 0.25*(sin(time*vec3(4.0,2.0,1.4))-sin(2.0*time*vec3(1.2,.5,.2)));
	}
	else if (abs((position.x*position.y) - 4.0*(sin(position.x  + time) + cos(position.y+time))) < 1.5 )
	{
		color =  color + 0.5 + 0.25*(sin(time*vec3(4.0,2.0,1.4))-sin(4.0*time*vec3(1.5,1.3,.1)));
	}*/
	if (abs(2.0*cos(time)*sin(position.x+time) - (position.y)) < 0.1)
	{
		color = color + 1.5 + 10.5*cos(1.0*position.x + time*vec3(1.414,2.717,2.)*2.0);
	}
	gl_FragColor = vec4(color,2.0);

}