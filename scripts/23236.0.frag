#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


vec3 circle ( vec2 position, float thickness, float radius )
{
	vec3 color = vec3(0.0);
	
	
	if ( distance(position, gl_FragCoord.xy) <= radius - thickness && distance(position, gl_FragCoord.xy) >= 0.0  )
	{
		color = vec3(1.0, 1.0, 0.0);
	}
	
	if ( distance(vec2(position.x + cos(time) * 100.0, position.y + sin(time) * 100.0), gl_FragCoord.xy) <= radius  )
	{
		color = vec3(1.0);
	}
	
	return color;
}

void main( void ) {	
	vec3 color = vec3(0.0);
	
	color = circle(mouse * resolution, 16.0, 32.0 );
	
	
	gl_FragColor = vec4(color, 1.0);

}