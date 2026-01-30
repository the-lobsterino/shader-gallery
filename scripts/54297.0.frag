#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float square(vec2 position, float x, float y, float size)
{
	float horizontal = step(x-size/2., position.x) * step(position.x, x+size/2.);
	float vertical = step(y-size/2., position.y) * step(position.y, y+size/2.);
	return horizontal * vertical;
}

float square_rotated(vec2 position, float x, float y, float size, float angle)
{
	float offset = 0.;
	vec2 local_position = position - vec2(x + offset, y + offset);
	vec2 rotated_position = vec2(
		cos(angle) * local_position.x - sin(angle) * local_position.y,
		sin(angle) * local_position.x + cos(angle) * local_position.y
	);
	
	return square(rotated_position, 0., 0., size);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy ) * vec2(1., resolution.y / resolution.x);

	float color = 0.0;
	vec3 total_square_color = vec3(0.);

	for (float x = -1.; x < 2.; x += 0.05)
	{
		for (float y = -1.; y < 2.; y += 0.2)
		{
			float offset_y = y + sin(x+time/4.)*0.2;
			float scale = 0.1 + 0.025 * sin(x + time + y*3.);
			
			vec3 square_color = vec3(mod(x+time/2. + y*3., 1.), y, 1.);
			total_square_color += square_rotated(position, x, offset_y, scale, -cos(x+time/4.)*0.2) * 0.2 * square_color;
		}
	}

	
	//gl_FragColor = vec4( vec3( color), 1.0 );
	gl_FragColor = vec4( total_square_color , 1.0 );
}