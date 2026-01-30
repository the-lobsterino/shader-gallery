#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 resolution;

void main(void)
{
	//orthographic matrix
	mat4 ortho_matrix = mat4(
        2.0/resolution.x, 0.0, 0.0, 0.0,
        0.0, 2.0/resolution.y, 0.0, 0.0,
        0.0, 0.0, -1.0, 0.0,
        0.0, 0.0, 0.0, 1.0
		//-1.0, 1.0, 0.0, 1.0
    	);
	
	//surface normal of the 2D plane (looking straight down)
	vec3 surface_normal = normalize(mix(vec3(-1), vec3(1), vec3(0.5, 0.5, 1.0)));

	//screen position of the light
	vec2 light_screen_pos = vec2(resolution.x/2.0, resolution.y/2.0);
	//vec2 light_screen_pos = vec2(1.0/2.0, 1.0/2.0);
	
	//translate light's position to normalized coordinates
	//the z value makes sure it is slightly above the 2D plane
	vec4 light_ortho_pos = ortho_matrix * vec4(light_screen_pos, -0.03, 1.0);
	
	//calculate the light for this fragment
	vec3 v = vec3(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 0.0);
 	
	//vec3 v = vec3(gl_FragCoord.x / resolution.x, gl_FragCoord.y / resolution.y, 0);
 	vec3 light_direction = light_ortho_pos.xyz - v;
	float dist = length(light_direction);
	light_direction = normalize(light_direction);
	vec3 light = clamp(dot(surface_normal, light_direction), 0.0, 1.0) * vec3(0.5, 0.5, 0.5);
	vec3 cel_light = step(0.15, (light.r + light.g + light.b) / 3.0) * light;
	
	//gl_FragColor = vec4(light_screen_pos.x, light_screen_pos.y, 0.0, 1.0);
	//gl_FragColor = vec4(light_ortho_pos.x, light_ortho_pos.y, 0.0, 1.0);
	gl_FragColor = vec4(light_direction.x, light_direction.y, 0.0, 1.0);
	
	//gl_FragColor = vec4(v.x, 0.0, v.y, 1.0);
	//gl_FragColor = vec4(pow(light + cel_light, vec3(0.4545)), 1.0);
}