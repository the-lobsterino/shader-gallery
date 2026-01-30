// Author: Masaki Hara (qnighy)
// https://github.com/qnighy/

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
const vec3 camera_up = vec3(0.0, 1.0, 0.0);
const float camera_distance = 10.0;

const vec3 sphere_center = vec3(0.0, 0.0, 0.0);
const float sphere_r = 0.2;

const vec3 blue_light_source = vec3(7.0, 20.0, 8.0);
const vec3 green_light_source = vec3(17.0, -10.0, -20.0);

void main( void ) {
	
	vec2 screen_pos = gl_FragCoord.xy / resolution.xy - 0.5;
	screen_pos.x *= resolution.x / resolution.y;
	
	vec2 mouse_pos = (mouse-0.5) / 10.0;
	mouse_pos.x *= resolution.x / resolution.y;

	vec3 target_pos = vec3(0.0, 0.0, 0.0);
	vec3 camera_pos = vec3(cos(time)*cos(sin(time*3.1)*0.5)*10.0, sin(sin(time*3.1)*0.5)*9.0, sin(time)*cos(sin(time*3.1)*0.5)*9.0);
	
	vec3 camera_w1 = normalize(target_pos - camera_pos);
	vec3 camera_u1 = normalize(cross(camera_up, camera_w1));
	vec3 camera_v1 = cross(camera_w1, camera_u1);
	vec3 camera_w2 = cos(mouse_pos.x) * camera_w1 + sin(mouse_pos.x) * camera_u1;
	vec3 camera_u2 = -sin(mouse_pos.x) * camera_w1 + cos(mouse_pos.x) * camera_u1;
	vec3 camera_v2 = camera_v1;
	vec3 camera_w = cos(mouse_pos.y) * camera_w2 + sin(mouse_pos.y) * camera_v2;
	vec3 camera_u = camera_u2;
	vec3 camera_v = -sin(mouse_pos.y) * camera_w2 + cos(mouse_pos.y) * camera_v2;
	
	vec3 ray = normalize(
		camera_distance * camera_w +
		screen_pos.x * camera_u +
		screen_pos.y * camera_v);
	
	vec3 posdiff = sphere_center - camera_pos;
	
	float equation_b = dot(ray, posdiff);
	float equation_c = dot(posdiff, posdiff) - sphere_r * sphere_r;
	float equation_d = equation_b * equation_b - equation_c;
	float equation_t = -1.0;
	if(equation_d >= 0.0) {
		equation_t = equation_c / (equation_b + sqrt(equation_d));
	}
	
	gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
	
	if(equation_t >= 0.0) {
		vec3 pos = equation_t * ray + camera_pos;
		vec3 normal = (equation_t * ray - posdiff) / sphere_r;
		float blue = dot(normal, normalize(blue_light_source - pos));
		vec3 green_vec1 = normalize(green_light_source - pos);
		vec3 green_vec2 = reflect(green_vec1, normal);
		float green_dot = dot(normalize(pos), -green_vec2);
		float green = 0.0;
		if(green_dot >= 0.0) {
			float green_acos = acos(green_dot);
			green = exp(-green_acos * green_acos * 10.0);
		}
		vec4 color = vec4(0.2, green, blue, 1.0);
		
		gl_FragColor = color;
	}

}
