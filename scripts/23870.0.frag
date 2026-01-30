// ray marching test
// by @yunta_robo


#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;


// -------------------------------------------------------------------------------------------------------------------------
float distance_function(vec3 _pos)
{
	// sphere
	vec3 sphere_center = vec3(-2.0, 1.0, 0.0);
	float sphere_radius = 1.0;
	float d1 = length(_pos - sphere_center) - sphere_radius;
	
	// round box
	vec3 rbox_center = vec3(2.0, 1.0, 0.0);
	vec3 rbox_side = vec3(0.5, 0.5, 0.5);
	float rbox_round = 0.5;
	float d2 =  length(max(abs(_pos - rbox_center) - rbox_side, 0.0)) - rbox_round;

	// torus
	vec3 torus_center = vec3(0.0, -1.0, 0.0);
	vec2 torus_param = vec2(1.5, 0.25);
	vec2 q = vec2(length(_pos.xz - torus_center.xz)-torus_param.x, _pos.y - torus_center.y);
  	float d3 = length(q) - torus_param.y;
	
	return min(min(d1, d2), d3);
}

vec3 get_normal(vec3 _pos)
{
	float delta = 0.0001;
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
	for(int i=0; i<16; i++)
	{
		d = distance_function(ray_pos);
		if(abs(d) < 0.001)
		{
			vec3 normal = get_normal(ray_pos);
//			color = normal;
			float light = clamp(dot(normal, -normalize(vec3(-1.0, -1.0, 1.0))), 0.0, 1.0);
			color = vec3(light * 1.0, light * 0.5, 0.25);
			break;
		}
		else
		{
			ray_pos += ray_dir * d;
		}
	}
	
	// output
	gl_FragColor = vec4(color, 1.0);
}

