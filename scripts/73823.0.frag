#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec3 color = vec3(0,0,0);
	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	
	float condition = 5. * position.x * position.x + position.y * ( 5. * position.y - 1.);
	
	
	if (condition > 0.1 && condition < sin(time*9.5) * 2. + 5.)
	{
		color = 2. * cos(position.y * position.x * 20. + time * vec3(2,5,8));
	}
	if (condition < 0.1)
	{
		color = 20. * cos(position.y * position.x * 1. + time * vec3(2,5,8));
	}
	
	gl_FragColor = vec4(color,1);

}