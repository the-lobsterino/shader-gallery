#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

float dx = 1.0/resolution.x;
float dy = 1.0/resolution.y;

float read_pixel(vec2 pos) {
	vec4 pixel = texture2D(backbuffer, pos)*255.0;
	float result = pixel.x/256.0/256.0;
	result += pixel.y/256.0;
	result += pixel.z;
	result += pixel.w*256.0;
	return result;
}
float read_pixel_funky(vec2 pos) {
	vec4 pixel = texture2D(backbuffer, pos)*255.0;
	float result = pixel.x/256.0/256.0;
	result += pixel.y/256.0;
	result += mod(pixel.z+1.0, 256.0);
	result += pixel.w*256.0;
	return result;
}
float read_pixel_1(vec2 pos) {
	vec4 pixel = texture2D(backbuffer, pos)*255.0;
	float result = pixel.x/256.0/64.0;
	result += mod(pixel.y+128.0, 256.0)/64.0;
	return result-2.0;
}
float read_pixel_funky_1(vec2 pos) {
	vec4 pixel = texture2D(backbuffer, pos)*255.0;
	float result = pixel.x/256.0/64.0;
	result += mod(pixel.y+192.0, 256.0)/64.0;
	return result-2.0;
}
void write_pixel(float to_write) {
	vec4 pixel;
	pixel.x = floor(mod(to_write*256.0*256.0, 256.0))/255.0;
	pixel.y = floor(mod(to_write*256.0, 256.0))/255.0;
	pixel.z = floor(mod(to_write, 256.0))/255.0;
	pixel.x = floor(mod(to_write/256.0, 256.0))/255.0;
	gl_FragColor = pixel;
}
void write_pixel_funky(float to_write) {
	vec4 pixel;
	pixel.x = floor(mod(to_write*256.0*256.0, 256.0))/255.0;
	pixel.y = floor(mod(to_write*256.0, 256.0))/255.0;
	pixel.z = floor(mod(to_write-1.0, 256.0))/255.0;
	pixel.x = floor(mod(to_write/256.0, 256.0))/255.0;
	gl_FragColor = pixel;
}
void write_pixel_1(float to_write) {
	vec4 pixel;
	pixel.x = floor(mod((to_write+2.0)*64.0*256.0, 256.0))/255.0;
	pixel.y = floor(mod((to_write+2.0)*64.0-128.0, 256.0))/255.0;
	gl_FragColor = pixel;
}
void write_pixel_funky_1(float to_write) {
	vec4 pixel;
	pixel.x = floor(mod((to_write+2.0)*64.0*256.0, 256.0))/255.0;
	pixel.y = floor(mod((to_write+2.0)*64.0-192.0, 256.0))/255.0;
	gl_FragColor = pixel;
}
vec3 get_pos() {
	float x = read_pixel(vec2(dx, dy));
	float y = read_pixel(vec2(4.0*dx, dy));
	float z = read_pixel(vec2(7.0*dx, dy));
	return vec3(x, y, z);
}
vec4 get_rot() {
	float r = read_pixel_funky_1(vec2(dx, 4.0*dy));
	float i = read_pixel_1(vec2(4.0*dx, 4.0*dy));
	float j = read_pixel_1(vec2(7.0*dx, 4.0*dy));
	float k = read_pixel_1(vec2(10.0*dx, 4.0*dy));
	return vec4(r, i, j, k);
}
vec4 multiply_q(vec4 q0, vec4 q1) {
	float r = q0.x*q1.x - q0.y*q1.y - q0.z*q1.z - q0.w*q1.w;
	float i = q0.x*q1.y + q0.y*q1.x + q0.z*q1.w - q0.w*q1.z;
	float j = q0.x*q1.z - q0.y*q1.w + q0.z*q1.x + q0.w*q1.y;
	float k = q0.x*q1.w + q0.y*q1.z - q0.z*q1.y + q0.w*q1.x;
	return vec4(r, i, j, k);
}
vec4 geometric(vec3 v0, vec3 v1) {
	float r = dot(v0, v1);
	vec3 imaginary = cross(v0, v1);
	return vec4(r, imaginary);
}
vec4 conjugate(vec4 q) {
	float r = q.x;
	float i = -q.y;
	float j = -q.z;
	float k = -q.w;
	return vec4(r, i, j, k);
}
vec4 inverse(vec4 q) {
	return conjugate(q)/length(q);
}
vec3 rotate(vec3 start, vec4 rotation) {
	vec4 result = multiply_q(rotation, vec4(0.0, start));
	result = multiply_q(result, inverse(rotation));
	return result.yzw;
}

void write_pos() {
	vec3 pos = get_pos();
	if(length(mouse*resolution - vec2(50.0, 38.0)) < 17.0) {
		vec3 forward = rotate(vec3(0.0, 0.0, 1.0), get_rot());
		pos += forward*0.05;
	}
	if(gl_FragCoord.x < 3.0) {
		write_pixel(pos.x);
	} else if(gl_FragCoord.x < 6.0) {
		write_pixel(pos.y);
	} else if(gl_FragCoord.x < 9.0) {
		write_pixel(pos.z);
	} else {
		gl_FragColor = vec4(0.0);
	}
}
void write_rot() {
	vec2 mouse_pos = mouse*resolution - vec2(50.0, 38.0);
	float m_len = length(mouse_pos);
	vec4 rot = get_rot();
	if(m_len < 30.0)
		if(m_len > 17.0) {
			vec3 forward = rotate(vec3(0.0, 0.0, 1.0), rot);
			vec3 dir = normalize(vec3(mouse_pos/resolution.y, 1.5));
			dir = rotate(dir, rot);
			rot = multiply_q(normalize(geometric(forward, dir)), rot);
		}
	if(gl_FragCoord.x < 3.0) {
		write_pixel_funky_1(rot.x);
	} else if(gl_FragCoord.x < 6.0) {
		write_pixel_1(rot.y);
	} else if(gl_FragCoord.x < 9.0) {
		write_pixel_1(rot.z);
	} else if(gl_FragCoord.x < 12.0) {
		write_pixel_1(rot.w);
	} else {
		gl_FragColor = vec4(0.0);
	}
	//gl_FragColor = vec4(0.0);
}
void memory() {
	gl_FragColor = vec4(vec3(0.0), 1.0);
	if(gl_FragCoord.x > 11.0) {
		gl_FragColor = vec4(vec3(1.0), 1.0);
		return;
	}
	if(gl_FragCoord.y < 3.0) {
		write_pos();
	} else if(gl_FragCoord.y < 6.0) {
		write_rot();
	}
}
void controls() {
	gl_FragColor = vec4(vec3(0.0), 1.0);
	if(length(gl_FragCoord.xy - vec2(50.0, 38.0)) < 30.0) {
		gl_FragColor = vec4(vec3(0.35), 1.0);
		if(length(gl_FragCoord.xy - mouse*resolution) < 10.0) {
			gl_FragColor = vec4(vec3(1.0), 1.0);
		}
	}
	if(length(gl_FragCoord.xy - vec2(50.0, 38.0)) < 17.0) {
		gl_FragColor = vec4(vec3(0.2), 1.0);
		if(length(mouse*resolution - vec2(50.0, 38.0)) < 17.0)
			gl_FragColor = vec4(vec3(0.65), 1.0);
	}
	if(gl_FragCoord.y > 77.0)
		gl_FragColor = vec4(vec3(1.0), 1.0);
}
float sd_grid(vec3 pos) {
	vec3 measure = mod(pos, 1.0)-0.5;
	float x_line = length(cross(measure, vec3(1.0, 0.0, 0.0)))-0.005;
	float y_line = length(cross(measure, vec3(0.0, 1.0, 0.0)))-0.005;
	float z_line = length(cross(measure, vec3(0.0, 0.0, 1.0)))-0.005;
	return min(min(x_line, y_line), z_line);
}
float sd_sphere(vec3 pos) {
	vec3 measure = mod(pos, 1.0)-0.5;
	return length(measure)-0.05;
}
void main( void ) {
	vec2 position = ( gl_FragCoord.xy / resolution.xy )-0.5;
	position *= 2.0*resolution.xy/resolution.y;
	
	//vec3 dir = normalize(vec3(position, 1.0));
	vec3 dir_r = normalize(vec3(position+vec2(0.25, 0.0), 1.0));
	vec3 dir_b = normalize(vec3(position-vec2(0.25, 0.0), 1.0));
	vec3 red = vec3(1.0, 0.2, 0.0);
	vec3 blue = vec3(0.0, 0.2, 1.0);
	bool exceed_r = false;
	bool exceed_b = false;
	//vec3 color = vec3(1.0, 0.0, 0.1);
	vec3 color = vec3(0.0);
	//dir = rotate(dir, get_rot());
	dir_r = rotate(dir_r, get_rot());
	dir_b = rotate(dir_b, get_rot());
	vec3 x_axis = rotate(vec3(1.0, 0.0, 0.0), get_rot());
	if(gl_FragCoord.x < 14.0) {
		memory();
		return;
	}
	if(gl_FragCoord.y < 80.0) {
		controls();
		return;
	}
	
	vec3 current_pos = get_pos()+x_axis*0.25;
	float d = 10.0;
	float last_d = 10.0;
	float total_d;
	for(int i = 0; i<40; i++) {
		d = min(sd_grid(current_pos), sd_sphere(current_pos));
		if(d < 0.01)
			break;
		current_pos += d*dir_r;
		last_d = d;
		total_d += d;
		if(i>39) {
			exceed_r = true;
		}
	}
	if(!exceed_r)
		//if(sd_grid(current_pos) < sd_sphere(current_pos))
		color += red*(1.0-d/last_d);
	current_pos = get_pos()-x_axis*0.25;
	for(int i = 0; i<40; i++) {
		d = min(sd_grid(current_pos), sd_sphere(current_pos));
		if(d < 0.01)
			break;
		current_pos += d*dir_b;
		last_d = d;
		total_d += d;
		if(i>39) {
			exceed_b = true;
		}
	}
	if(!exceed_b)
		//if(sd_grid(current_pos) < sd_sphere(current_pos))
		color += blue*(1.0-d/last_d);

	gl_FragColor = vec4(color*2.0, 1.0) - vec4(vec3(total_d/15.0), 0.0);
}