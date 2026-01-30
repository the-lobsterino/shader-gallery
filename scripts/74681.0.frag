precision mediump float;
precision mediump int;

#define PI 3.1415926

uniform float time;
uniform vec2 resolution;

const float accuracy = 0.001;
const float unit = 1.;
vec2 center;
float ratio;
vec2 p;

vec4 finalColor = vec4(0., 0., 0., 0.);

bool equalFloat(float a, float b) {
	return abs(a - b) <= accuracy;
}

float norm (vec2 a) {
	return sqrt(a.x * a.x + a.y * a.y);
} 

vec2 normal (vec2 a) {
	return normalize(vec2(-a.y, a.x));
}

bool inRight (vec2 a, vec2 b) {
	return cross(vec3(a, 0.), vec3(b, 0.)).z < 0.;
}

void draw_color (vec4 color) {
	if (color.a >= finalColor.a) {
		finalColor = color;
	}
}

void draw_line (vec2 sp, vec2 ep, float width, vec4 color) {
	vec2 d = normalize(ep - sp);
	vec2 n = normal(d);
	vec2 vertex[4];
	vertex[0] = sp + 0.5 * width * (n - d);
	vertex[1] = sp - 0.5 * width * (n + d);
	vertex[2] = ep - 0.5 * width * (n - d);
	vertex[3] = ep + 0.5 * width * (n + d);
	if (inRight(vertex[1] - vertex[0], p - vertex[0])) return;
	if (inRight(vertex[2] - vertex[1], p - vertex[1])) return;
	if (inRight(vertex[3] - vertex[2], p - vertex[2])) return;
	if (inRight(vertex[0] - vertex[3], p - vertex[3])) return;
	draw_color(color);
}

void draw_line_light (vec2 sp, vec2 ep, float width, vec4 color) {
	vec4 outer_color = vec4(0., 0., 0., 0.);
	vec4 decay = (outer_color - color) / width;
	for (float i = 0.; i < 100.; i += 1.) {
		float w = width - i;
		if (w > 0.) {
			draw_line(sp, ep, w, outer_color + decay * (w - width));
		} else {
			break;
		}
	}
}

void draw_ring (vec2 origin, float r, float width, vec4 color) {
	float r_min = r - 0.5 * width;
	float r_max = r + 0.5 * width;
	float d = norm(p - origin);
	if (d <= r_max && d >= r_min) {
		draw_color(color);
	}
}

void draw_ring_light (vec2 origin, float r, float width, vec4 color) {
	vec4 outer_color = vec4(0., 0., 0., 0.);
	vec4 decay = (outer_color - color) / width;
	for (float i = 0.; i < 100.; i += 1.) {
		float w = width - i;
		if (w > 0.) {
			draw_ring(origin, r, w, outer_color + decay * (w - width));
		} else {
			break;
		}
	}
}

void draw_circle (vec2 origin, float r, vec4 color) {
	float d = norm(p - origin);
	if (d <= r) {
		draw_color(color);
	}
}

void draw_circle_light (vec2 origin, float r, float er, vec4 color) {
	vec4 outer_color = vec4(0., 0., 0., 0.);
	vec4 decay = (outer_color - color) / (r - er);
	for (float i = 0.; i < 100.; i += 1.) {
		float nr = r - i;
		if (nr > er) {
			draw_circle(origin, nr, color + decay * (nr - er));
		} else {
			break;
		}
	}
}

void main() {

	center = 0.5 * resolution.xy;

	ratio = resolution.x / resolution.y;

	p = vec2(floor(gl_FragCoord.x / unit + 0.5) * unit, floor(gl_FragCoord.y / unit + 0.5) * unit);

	draw_line_light(vec2(0., 0.), vec2(resolution.x, resolution.y), 15., vec4(0.7 + 0.3 * sin(time), 0., 0.6 + 0.4 * cos(time), 1.));

	vec2 origin = vec2((0.5 + 0.1 * cos(time)) * resolution.x, (0.5 + 0.1 * cos(time)) * resolution.y);
	float ringR = 100. + 20. * sin(time);
	draw_ring_light(origin, ringR, 20., vec4(0.7 + 0.3 * sin(time), 0., 0.6 + 0.4 * cos(time), 1.));

	float rotateR = ringR * 5. / 3.;
	float circleR = ringR / 4.;
	draw_circle_light(vec2(origin.x + ratio * rotateR * sin(time), origin.y + rotateR * cos(time)), circleR, circleR * 0.7 - circleR * 0.1 * cos(time), vec4(0.5 + 0.5 * sin(time), 1., 0., 1.));
	rotateR = ringR * 8. / 3.;
	circleR = ringR / 3.;
	draw_circle_light(vec2(origin.x + ratio * rotateR * cos(time), origin.y + rotateR * sin(time)), circleR, circleR * 0.7 - circleR * 0.1 * sin(time), vec4(1., 0.5 + 0.5 * cos(time), 0., 1.));
	
	gl_FragColor = finalColor;

}