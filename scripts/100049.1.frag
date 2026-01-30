#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;

//  from polar to rectangular
vec2 from_polar(float r, float angle)
{
	return vec2(r * cos(angle), r * sin(angle));
}

float rand(vec2 seed)
{
	return pow(fract(sin(dot(seed.xy, vec2(923333333333333333330.1996, 67.89))) * 65536.1337), 69.0);
}

void main()
{
	vec3 color;
	vec2 uv = vec2(gl_FragCoord.x, gl_FragCoord.y) / min(resolution.x, resolution.y);
	
	//  positions
	float sun_y = sin(time) * 0.5 + 0.3;
	float moon_y = sin(time) * 0.5 + 1.3;
	float ground_y = sin(uv.x * 3.0 + time * 1.5) * 0.1 + 0.2;
	vec2 figure_xy = vec2(0.5, 0.195 + sin(0.5 * 3.0 + time * 1.5) * 0.1 + 0.2);

	//  factors
	float sun_rgb = 1.0 - smoothstep(0.055, 0.1 + sin(time) * 0.04, distance(uv, vec2(0.85, sun_y)));
	float moon_rgb = 1.0 - smoothstep(0.095, 0.1, distance(uv, vec2(0.85, moon_y)));
	float ground_rgb = smoothstep(0.005, 0.0, uv.y - ground_y);
	float stars_rgb = 1.0 - smoothstep(-0.2, 0.0, sun_y);
	
	float center_r = smoothstep(0.045, 0.05, distance(uv + from_polar(0.085, -time * 1.50 + 2.0 * 3.1415926 * 0.00), figure_xy));
	float center_g = smoothstep(0.045, 0.05, distance(uv + from_polar(0.085, -time * 1.50 + 2.0 * 3.1415926 * 0.33), figure_xy));
	float center_b = smoothstep(0.045, 0.05, distance(uv + from_polar(0.085, -time * 1.50 + 2.0 * 3.1415926 * 0.66), figure_xy));
	
	float figure_r = 1.0 - smoothstep(0.095, 0.1, distance(uv + from_polar(0.085, -time * 1.50 + 2.0 * 3.1415926 * 0.00), figure_xy));
	float figure_g = 1.0 - smoothstep(0.095, 0.1, distance(uv + from_polar(0.085, -time * 1.50 + 2.0 * 3.1415926 * 0.33), figure_xy));
	float figure_b = 1.0 - smoothstep(0.095, 0.1, distance(uv + from_polar(0.085, -time * 1.50 + 2.0 * 3.1415926 * 0.66), figure_xy));

	//  figure
	color.r = 0.2 * sun_y + figure_r * center_r;
	color.g = 0.2 * sun_y + figure_g * center_g;
	color.b = 0.5 * sun_y + figure_b * center_b;
	
	// sun & ground
	color.r += sun_rgb - 2.0 * ground_rgb;
	color.g += sun_rgb * 0.7 + (0.4 - 0.7 * sun_rgb) * ground_rgb;
	color.b -= sun_rgb + ground_rgb;
	
	//  moon
	color.r += 2.0 * moon_rgb;
	color.g += 2.0 * moon_rgb;
	color.b += 2.0 * moon_rgb;
	
	//  stars
	color.r += 0.5 * stars_rgb * rand(uv) * (1.0 - ground_rgb) * (1.0 - figure_r * center_r) * (1.0 - figure_g * center_g) * (1.0 - figure_b * center_b);
	color.g += 0.5 * stars_rgb * rand(uv) * (1.0 - ground_rgb) * (1.0 - figure_r * center_r) * (1.0 - figure_g * center_g) * (1.0 - figure_b * center_b);
	color.b += 0.5 * stars_rgb * rand(uv) * (1.0 - ground_rgb) * (1.0 - figure_r * center_r) * (1.0 - figure_g * center_g) * (1.0 - figure_b * center_b);
	
	gl_FragColor = vec4(color, 1.0);
}
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

//  uniform sampler2D backbuffer;

bool        lag_time;
vec2        coord_r;
vec2        coord_g;
vec2        coord_b;
vec2        center           = resolution / 2.0;
const float deg              = 3.1415926 / 180.0;
const float background_color = 0.2;
const float head_size        = 150.0;
const float mouth_size       = 75.0;
const float eye_size         = 40.0;

vec2 circle_color(vec2 pos, float r, float color, float current_color, vec2 current_coord) {
	//  result[0] - result
	//  result[1] - if lower than 0.0 - nothing was drawn, if greater than 0.0 - something was drawn
	vec2 result = vec2(-1.0);

	if (distance(pos, current_coord) < r + 3.0) {
		float temp = smoothstep(r + 3.0, r, distance(pos, current_coord));
		result[0] = temp * color + (1.0 - temp) * current_color;
		result[1] = 1.0;
	}

	return result;
}

bool circle(vec2 pos, float r, vec3 color) {
	bool result = false;
	vec2 temp;

	temp = circle_color(pos, r, color.r, gl_FragColor.r, coord_r);
	if (temp[1] > 0.0) {
		gl_FragColor.r = temp[0];
		result = true;
	}

	temp = circle_color(pos, r, color.g, gl_FragColor.g, coord_g);
	if (temp[1] > 0.0) {
		gl_FragColor.g = temp[0];
		result = true;
	}

	temp = circle_color(pos, r, color.b, gl_FragColor.b, coord_b);
	if (temp[1] > 0.0) {
		gl_FragColor.b = temp[0];
		result = true;
	}

	return result;
}

vec2 dead_eye_color(vec2 pos, float size, float color, float current_color, vec2 current_coord) {
	//  result[0] - result
	//  result[1] - if lower than 0.0 - nothing was drawn, if greater than 0.0 - something was drawn
	vec2 result = vec2(-1.0);

	if (current_coord.y - pos.y >= tan(deg * 45.0) * (current_coord.x - pos.x) - size / 2.0
	   && current_coord.y - pos.y <= tan(deg * 45.0) * (current_coord.x - pos.x) + size / 2.0
	   || current_coord.y - pos.y >= tan(deg * -45.0) * (current_coord.x - pos.x) - size / 2.0
	   && current_coord.y - pos.y <= tan(deg * -45.0) * (current_coord.x - pos.x) + size / 2.0) {
		float temp = smoothstep(size + 3.0, size, distance(pos, current_coord));
		if (temp > 0.0) {
			result[0] = temp * color + (1.0 - temp) * current_color;
			result[1] = 1.0;
		}
	}

	return result;
}

bool dead_eye(vec2 pos, float size, vec3 color) {
	bool result = false;
	vec2 temp;

	temp = dead_eye_color(pos, size, color.r, gl_FragColor.r, coord_r);
	if (temp[1] > 0.0) {
		gl_FragColor.r = temp[0];
		result = true;
	}

	temp = dead_eye_color(pos, size, color.g, gl_FragColor.g, coord_g);
	if (temp[1] > 0.0) {
		gl_FragColor.g = temp[0];
		result = true;
	}

	temp = dead_eye_color(pos, size, color.b, gl_FragColor.b, coord_b);
	if (temp[1] > 0.0) {
		gl_FragColor.b = temp[0];
		result = true;
	}

	return result;
}

vec2 mouth_color(vec2 pos, float size, float color, float current_color, vec2 current_coord) {
	//  result[0] - result
	//  result[1] - if lower than 0.0 - nothing was drawn, if greater than 0.0 - something was drawn
	vec2 result = vec2(-1.0);

	if (distance(pos, current_coord) < size + 3.0 && distance(pos + vec2(0.0, size * 1.5), current_coord) > size * 2.0) {
		float temp = min(
			smoothstep(size + 3.0, size, distance(pos, current_coord)),
			smoothstep(size * 2.0, size * 2.0 + 3.0, distance(pos + vec2(0.0, size * 1.5), current_coord))
		);
		result[0] = temp * color + (1.0 - temp) * current_color;
		result[1] = 1.0;
	}

	return result;
}

bool mouth(vec2 pos, float size, vec3 color) {
	bool result = false;
	vec2 temp;

	temp = mouth_color(pos, size, color.r, gl_FragColor.r, coord_r);
	if (temp[1] > 0.0) {
		gl_FragColor.r = temp[0];
		result = true;
	}

	temp = mouth_color(pos, size, color.g, gl_FragColor.g, coord_g);
	if (temp[1] > 0.0) {
		gl_FragColor.g = temp[0];
		result = true;
	}

	temp = mouth_color(pos, size, color.b, gl_FragColor.b, coord_b);
	if (temp[1] > 0.0) {
		gl_FragColor.b = temp[0];
		result = true;
	}

	return result;
}

//  x * x   y * y
//  ----- = ----- = 1 - ellipse
//  a * a   b * b
vec2 dead_mouth_color(vec2 pos, float size, float color, float current_color, vec2 current_coord) {
	//  result[0] - result
	//  result[1] - if lower than 0.0 - nothing was drawn, if greater than 0.0 - something was drawn
	vec2  result     = vec2(-1.0);
	vec2  temp_coord = pos - current_coord;  //  distance from origin (dot (0; 0))
	float temp       = smoothstep(1.0, 0.9, (temp_coord.x * temp_coord.x) / (size * size) + (temp_coord.y * temp_coord.y) / (size * size * 0.25));

	if (temp > 0.0) {
		result[0] = temp * color + (1.0 - temp) * current_color;
		result[1] = 1.0;
	}

	return result;
}

bool dead_mouth(vec2 pos, float size, vec3 color) {
	bool result = false;
	vec2 temp;

	temp = dead_mouth_color(pos, size, color.r, gl_FragColor.r, coord_r);
	if (temp[1] > 0.0) {
		gl_FragColor.r = temp[0];
		result = true;
	}

	temp = dead_mouth_color(pos, size, color.g, gl_FragColor.g, coord_g);
	if (temp[1] > 0.0) {
		gl_FragColor.g = temp[0];
		result = true;
	}

	temp = dead_mouth_color(pos, size, color.b, gl_FragColor.b, coord_b);
	if (temp[1] > 0.0) {
		gl_FragColor.b = temp[0];
		result = true;
	}

	return result;
}

void preprocess() {
	if (lag_time) {
		if (sin(time * 4.0) > 0.2) {
			coord_r.x += 20.0;
			coord_g.x += 20.0;
			coord_b.x += 20.0;
		}
		
		if (sin(time * 8.0) > 0.2) {
			if (gl_FragCoord.x < center.x && gl_FragCoord.y > center.y) {
				coord_r.x += 20.0;
				coord_g.x += 40.0;
				coord_b.x += 30.0;
			} else if (gl_FragCoord.x > center.x && gl_FragCoord.y < center.y) {
				coord_r.x -= 40.0;
				coord_g.x -= 20.0;
				coord_b.x -= 20.0;
			}
		}
		
		//  turn upside down
		if (sin(time * 2.0) > 0.5) {
			coord_r.y = resolution.y - coord_r.y;
			coord_g.y = resolution.y - coord_g.y;
			coord_b.y = resolution.y - coord_b.y;
		}
		
		coord_r += 3.0;
		coord_g.x += sin(gl_FragCoord.y * 4.0) * 2.0 + cos(time * 10.0) * 2.0;

		if (sin(gl_FragCoord.x / 12.0) > 0.6)
			coord_g.y += 5.0;
		if (sin(gl_FragCoord.y / 10.0) > 0.0)
			coord_r.x += 3.0;
		
		coord_r.x += sin(gl_FragCoord.y / 12.0 + time * 12.0) * 2.0;
		coord_g.x += cos(gl_FragCoord.y / 12.0 + time * 12.0) * 2.0;
		coord_b.x += sin(gl_FragCoord.y / 12.0 + time * 12.0) * 2.0;
	}
}

void postprocess() {
	if (lag_time) {
		if (sin(gl_FragCoord.x / 8.0) > 0.0)
			gl_FragColor.b += 0.4;
		
		if (sin(gl_FragCoord.x) > 0.1 && fract(cos(gl_FragCoord.y) * resolution.y) > 0.1 && sin(time * 8.0) > 0.3) {
			gl_FragColor = vec4(gl_FragColor.rgb * 0.8 + 0.2, 1.0);
		}
	}
}