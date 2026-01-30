#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const int MAX_DEPTH = 50;
vec3 WHITE = vec3(1., 1., 1.);
vec3 BLACK = vec3(0., 0., 0.);
vec3 RED = vec3(1., 0., 0.);
vec3 GREEN = vec3(0., 1., 0.);
vec3 BLUE = vec3(0., 0., 1.);
vec3 sea_blue = vec3(0.2, 0.7, 0.8);
vec3 sea_green = vec3(0.2, 0.8, 0.5);
vec3 beach_red = vec3(0.8, 0.3, 0.2);
vec3 beach = vec3(1,1,0.8);

#define hf highp float

hf value_mix (hf v1, hf v2, hf k) {
	return v1 * k + v2 * (1. - k);
}

vec3 color_mix (vec3 color1, vec3 color2, hf k) {
	if (k <= 0.) k = 0.;
	if (k >= 1.) k = 1.;
	return color1 * k + color2 * (1. - k);
}

hf triangle(vec2 bottom_left, vec2 top_right, vec2 point, int depth) {
	
	vec2 new_bottom_left;
	vec2 new_top_right;
	hf alpha = 1.;
	
	for (int i = 0; i < MAX_DEPTH; i++) {
		if (i >= depth) {
			break;
		}
		vec2 center = (bottom_left + top_right) / 2.;
		if (point.y < center.y) {
			if (point.x < center.x) {
				new_bottom_left = vec2(bottom_left.x, bottom_left.y);
				new_top_right = vec2(center.x, center.y);
			} else {
				new_bottom_left = vec2(center.x, bottom_left.y);
				new_top_right = vec2(top_right.x, center.y);
			}
		}
		else {
			hf x_left_side = (bottom_left.x * 3. + top_right.x) * 0.25;
			hf x_right_side = (bottom_left.x + top_right.x * 3.) * 0.25;
			if (point.x > x_left_side && point.x < x_right_side) {
				new_bottom_left = vec2(x_left_side, center.y);
				new_top_right = vec2(x_right_side, top_right.y);
			}
			else {
				//new_bottom_left = vec2(x_left_side, center.y);
				//new_top_right = vec2(x_right_side, top_right.y);
				//vec2 new_center = (new_bottom_left + new_top_right) / 2.;
				hf p = float(i);
				hf alpha_cur = 1. - 1./ pow(1.2, p);
				hf alpha_next = 1. - 1./ pow(1.2, p+5.);
				hf k_vert = abs(point.y - center.y) / abs(bottom_left.y - center.y);
				hf k_hor = abs(point.x - center.x) / abs(bottom_left.x - center.x);
				hf k = min(k_vert, k_hor);
				if (k >= 1.) k = 1.;
				alpha = value_mix(alpha_next, alpha_cur, 1. - k);
				//alpha = alpha_next;
				//alpha = alpha_cur;
				break;
			}
		}
		bottom_left = new_bottom_left;
		top_right = new_top_right;
	}
	return alpha;
}


highp float dist_to_even(highp float n) {
	hf floor_to_even = floor(n/2.) * 2.;
	hf dist = n - floor_to_even;
	return (dist < 1. ? dist : 2.-dist);
}


void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	vec3 color;
	
	const hf STAGE_1 = 3.;
	const hf STAGE_2 = STAGE_1 + 7.;
	const hf STAGE_3 = STAGE_2 + 10.;
	const hf STAGE_4 = STAGE_3 + 15.;
	const hf STAGE_5 = STAGE_4 + 5.;
	
	vec4 st_full;
	hf alpha;
	
	if (time < STAGE_1) {
	
		highp int d = int(pow(2.,time*2.));
		
		alpha = triangle(vec2(0.,0.), vec2(1.,1.), position, d);
	}
	else {
		vec2 center = vec2(0.25, 0.5);
		vec2 pos_zoomed = center + (position - center) * 1. / (time - STAGE_1 + 1.);
		alpha = triangle(vec2(0.,0.), vec2(1.,1.), pos_zoomed, 50);
	}
	vec3 triangle_bw = color_mix(BLACK, WHITE, alpha);
	gl_FragColor = vec4(triangle_bw, 1.);
	
	if (time > STAGE_2) {
		
		hf gradient_width = 0.2;
		float lightness = position.x;
		
		hf slow_time = time/5.;
		hf wave = 0.;
		if (time < STAGE_4) {
			if (position.x < dist_to_even(slow_time)) {
				//lightness = 0.5;
				wave = 1.;
			} else if (position.x - gradient_width < dist_to_even(slow_time)) {
				wave = 1. - (position.x - dist_to_even(slow_time)) / gradient_width;
				
			} // else wave = 0
		} else if (time < STAGE_5) {
			
			if (position.x * 0.8 + gradient_width < dist_to_even(slow_time)) {
				//lightness = 0.5;
				wave = 1.;
			} else if (position.x * 0.8 < dist_to_even(slow_time)) {
				wave = 1. - (position.x * 0.8 + gradient_width - dist_to_even(slow_time)) / gradient_width;
				
			} // else wave = 0
		}
		
		
		hf transition;
		if (time > STAGE_3) {
			transition = 1.;
		} else {
			transition = 1. - (STAGE_3 - time) / (STAGE_3 - STAGE_2);
		}
		
		vec3 triangle_color, beach_color;
		if (time > STAGE_4) {
			triangle_color = color_mix(sea_green, BLACK, wave);//sea_green * wave + beach_red * (1.-wave);
			beach_color = lightness * color_mix(sea_blue, WHITE, wave);// (wave * sea_blue + (1. - wave) * beach);
		}
		else {
			triangle_color = color_mix(sea_green, beach_red, wave);//sea_green * wave + beach_red * (1.-wave);
			beach_color = lightness * color_mix(sea_blue, beach, wave);// (wave * sea_blue + (1. - wave) * beach);
		}
	
		alpha = triangle(vec2(0.,0.), vec2(1.,1.), position, 50);
		
		gl_FragColor = vec4( color_mix(color_mix(triangle_color, beach_color, alpha), triangle_bw, transition), 1.);
		//gl_FragColor = vec4( color_mix(triangle_color, beach_color, alpha), 1.);
	}
	
}