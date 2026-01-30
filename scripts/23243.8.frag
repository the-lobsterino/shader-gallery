#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 circle ( vec2 position, float thickness, float radius )
{
	vec3 color = vec3(0.7);
	
	position -= vec2(175,175);
	
	if ( distance(position, gl_FragCoord.xy) <= radius - thickness && distance(position, gl_FragCoord.xy) >= 0.0)
	{
		color = vec3(1.0,sin(time * 5.0) / 2.0,0);
	}
	if ( distance(position, gl_FragCoord.xy) <= radius * sin(time * 500.0) - thickness && distance(position, gl_FragCoord.xy) >= 0.0)
	{
		color = vec3(1.0,0.5,0);
	}
	
	if ( distance(vec2(position.x + cos(time * 1.0002) * 100.0, position.y + sin(time) * 100.0), gl_FragCoord.xy) <= radius / 3.0  )
	{
		color = vec3(0.4, 0.1, 0.3);
	}
	if ( distance(vec2(position.x + cos(time * 1.2001) * 40.0, position.y + sin(time * 1.2003) * 40.0), gl_FragCoord.xy) <= radius / 4.0  )
	{
		color = vec3(0.1, 0.5, 0.1);
	}
	if ( distance(vec2(position.x + cos(time * 1.0997) * 65.0, position.y + sin(time * 1.1) * 65.0), gl_FragCoord.xy) <= radius / 2.0  )
	{
		color = vec3(0.1, 0.1, 1);
	}
	
	
	if(distance(position, gl_FragCoord.xy) >= 110.0)
	{
		color = vec3(0,0,0);
	}
	
	
	return color;
}

void main( void ) {	
	vec3 color = vec3(0.0);
	
	color = circle(resolution, 1.0, 16.0 );
	
	
	gl_FragColor = vec4(color, 1.0);

}