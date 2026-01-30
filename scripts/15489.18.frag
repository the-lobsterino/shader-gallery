#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

bool ripple(vec2 position, float radius)
{
	bool retval = false;
	
	float distance = sqrt((((gl_FragCoord.x/resolution.x) - mouse.x)*((gl_FragCoord.x/resolution.x) - mouse.x)) +
			(((gl_FragCoord.y/resolution.y) - mouse.y)*((gl_FragCoord.y/resolution.y) - mouse.y)));
	
	if(distance > radius*mod(time, 10.0) && distance < radius*mod(time, 10.0) + 0.01)
		retval = true;
		
	return retval;
}

void main( void )
{
	vec2 position = vec2(gl_FragCoord.x, gl_FragCoord.y);
	position.x = 2.0*position.x-1.0;
	position.y = (position.y*2.0) -1.0;
	
	vec3 color_time = vec3(1.0,1.0,1.0);//vec3(1.0 * sin(time), 0.5 * sin(time), .33 * sin(time));
	
	vec3 loc_time = vec3(gl_FragCoord.x/resolution.x * sin(time), gl_FragCoord.y/resolution.y * sin(time), 0.5*sin(time));

	vec3 location = vec3(1.0,1.0,1.0);
	
	float radius = 0.2;
	for(int ii = 0; ii < 100; ii++)
	{
		//radius += float(ii)/1000.0;
		if(ripple(position, radius))
			gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
		else
			gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
		
	}
		//gl_FragColor = vec4((gl_FragCoord.x)/resolution.x * color_time.x,(gl_FragCoord.y)/resolution.y * color_time.y, color_time.z, 1.0);
}