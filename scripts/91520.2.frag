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

#define hf highp float

vec4 triangle(vec2 bottom_left, vec2 top_right, vec2 point, int depth, vec3 st_color) {
	
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
				hf p = float(i);
				alpha = 1. - 1./ pow(1.1, p);
				break;
			}
		}
		bottom_left = new_bottom_left;
		top_right = new_top_right;
	}
	return vec4(st_color.x, st_color.y, st_color.z, alpha);
}


highp float dist_to_even(highp float n) {
	hf floor_to_even = floor(n/2.) * 2.;
	hf dist = n - floor_to_even;
	return (dist < 1. ? dist : 2.-dist);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );
	//vec3 green = vec3(0.5, 1, 0.33);
	vec3 sea_blue = vec3(0.2, 0.7, 0.8);
	vec3 sea_green = vec3(0.2, 0.8, 0.5);
	vec3 beach_red = vec3(0.8, 0.3, 0.2);
	vec3 beach = vec3(1,1,0.8);
	//hf gradient_width = 0.2 + 0.01* (sin((position.y + position.x/3.)*50.) + 1.5);
	hf gradient_width = 0.2;
	float lightness = position.x;
	
	hf slow_time = time/5.;
	hf stage = 0.;
	if (position.x < dist_to_even(slow_time)) {
		//lightness = 0.5;
		stage = 1.;
	} else if (position.x - gradient_width < dist_to_even(slow_time)) {
		stage = 1. - (position.x - dist_to_even(slow_time)) / gradient_width;
		
	} // else stage = 0
	vec3 st_color = sea_green * stage + beach_red * (1.-stage);

	highp int d = int(pow(2.,time));
	vec4 st_full = triangle(vec2(0.,0.), vec2(1.,1.), position, d, st_color);
	vec3 st = vec3(st_full.x, st_full.y, st_full.z);
	hf alpha = st_full.a;
	vec3 beach_color = lightness * (stage * sea_blue + (1. - stage) * beach);
	gl_FragColor = vec4( st * alpha + beach_color * (1.-alpha), 1.0 );

}