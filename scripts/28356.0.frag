// strange sphere
// by @yunta_robo


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


#define ITE_MAX		160
#define DIST_MIN	0.005


// -------------------------------------------------------------------------------------------------------------------------
float distance_function(vec3 _pos)
{
	// sphere
	vec3 sphere_center = vec3(0.0, 0.0, 0.0);
	float sphere_radius = 2.0;
	float d = length(_pos - sphere_center) - sphere_radius;

	// anim
	float anim = sin(time);
	d += anim * tan( time ) * 12.0 * sin( 5.0 * _pos.x) * sin(5.0 * _pos.y) * sin(5.0 * _pos.z) * -0.1;
	anim = cos(time);
	d += anim * cos(7.111 * _pos.x) * sin(7.111 * _pos.y) * cos(7.111 * _pos.z) * 0.1;

	return d;
}   

vec3 get_normal(vec3 _pos)
{
	float delta = 0.1;
	vec3 v;
	v.x = distance_function(_pos + vec3(delta, 0.0, 0.0)) - distance_function(_pos + vec3(-delta, 0.0, 0.0));
	v.y = distance_function(_pos + vec3(0.0, delta, 0.0)) - distance_function(_pos + vec3(0.0, -delta, 0.0));
	v.z = distance_function(_pos + vec3(0.0, 0.0, delta)) - distance_function(_pos + vec3(0.0, 0.0, -delta));
	return normalize(v);
}


// -------------------------------------------------------------------------------------------------------------------------
void main( void )
{
	// position
	vec2 position = (gl_FragCoord.xy * 2.0 - resolution) / resolution.y;
	
	// view
	vec3 view_start = vec3(0.0, 0.0, -5.0);
	vec3 view_at = vec3(0.0, 0.0, 1.0);
	vec3 view_up = vec3(0.0, 1.0, 0.0);
	vec3 view_right = -cross(view_at, view_up);
	float view_focus = 1.8;	// fov_deg = atan(1 / view_focus) * (180 / pi) * 2
	
	// ray
	vec3 ray_dir = normalize(view_right * position.x + view_up * position.y + view_at * view_focus);
	
	// main process
	vec3 color = vec3(0.0);
	vec3 ray_pos = view_start;
	float d;
	for(int i=0; i<ITE_MAX; i++)
	{
		d = distance_function(ray_pos);
		ray_pos += ray_dir * d;
		if(abs(d) < DIST_MIN)
		{
			vec3 normal = get_normal(ray_pos);
			vec3 light_dir = normalize(vec3(-1.0, -1.0, 0.5));
			vec3 half_vec = normalize(-light_dir + -ray_dir);
			
			// diffuse
			color = vec3(0.0, 0.0, 0.15 * max(dot(normal, -light_dir), 0.0));
			
			// rim
			float rim = pow(1.0 - max(dot(normal, -ray_dir), 0.0), 3.0);
			color += vec3(rim, rim, rim);

			// specular
			color += vec3(pow(max(dot(half_vec, normal), 0.0), 100.0) * 3.0);
			
			// height
			color += vec3(0.0, 0.0, max((length(ray_pos) - 2.0), 0.0) * 3.0);
			break;
		}
	}
	
	// output
	gl_FragColor = vec4(color, 1.0);
}

