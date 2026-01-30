// circles by @davidppp

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float circles_per_row = 50.;
const float circle_radius = 0.5 * (1. / circles_per_row);
const float radius_width = 0.8;

bool nearest_circle(vec2 pos, float size_mod) {
	float radius = size_mod * circle_radius;
	
	float col = floor(pos.x * circles_per_row) / circles_per_row;
	float row = floor(pos.y * circles_per_row / 0.866);
	
	vec2 start = vec2(col, row * circle_radius * 2. * 0.866);
	
	// Check four potential targets around pos
	vec2 test_a = start;
	vec2 test_b = start + vec2(2. * circle_radius, 0);
	vec2 test_c = start + vec2(circle_radius, 2. * circle_radius * 0.866);
	vec2 test_d = start + vec2(3. * circle_radius, 2. * circle_radius * 0.866);
	
	if ((row - 2. * floor(row/2.)) == 0.) {
		test_a += vec2(circle_radius, 0.0);
		test_b += vec2(circle_radius, 0.0);
		test_c -= vec2(circle_radius, 0.0);
		test_d -= vec2(circle_radius, 0.0);
	}
	
	if (distance(pos, test_a) < radius && distance(pos, test_a) > radius * radius_width)
		return true;
	
	if (distance(pos, test_b) < radius && distance(pos, test_b) > radius * radius_width)
		return true;
	
	if (distance(pos, test_c) < radius && distance(pos, test_c) > radius * radius_width)
		return true;

	if (distance(pos, test_d) < radius && distance(pos, test_d) > radius * radius_width)
		return true;
	
	return false;
}

void main( void ) {
	vec2 center = vec2(resolution.x * 0.5, resolution.y * 0.5);
	vec2 pos = vec2(gl_FragCoord.x / 1024.0, gl_FragCoord.y / 1024.0);
	float theta = time * 3.;
	
	float size_mod = 0. + (sin(theta + distance(pos, center)) * 0.5 + 0.5);
	
	if (nearest_circle(pos, size_mod)) {
		gl_FragColor = vec4(1.0, 1.0, 0.3*((gl_FragCoord).x*0.005), 1.);
	} else {
		gl_FragColor = vec4(0.0);
	}
}