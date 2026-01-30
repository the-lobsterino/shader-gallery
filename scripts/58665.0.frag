#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

#define PI 3.14159265359
#define square(x) ((x) * (x))

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float fmod(float a, float b) {
	return a - floor(a / b);
}

float magnitude(vec2 v) {
	return distance(vec2(0.0,0.0), v);
}

vec3 compute_color(float x_thing, float y_thing, float a, float b, vec2 position) {
	float mapped_x = 1.0 - (a * square(position.x)) + position.y;
	float mapped_y = b * position.x;
	vec2 mapped_position = vec2(mapped_x, mapped_y);

	float distance = distance(position, mapped_position);
	float wow = fmod(time, 2.0);
	wow = (wow > 1.0 ? 1.0 - (wow - 1.0) : wow);
	float red = pow(distance, -(0.5 + pow(x_thing, 0.5)));
	float green = pow(distance, -(0.5 + pow(magnitude(vec2(x_thing,y_thing)), 0.5)));
	float blue = pow(distance, -(0.5 + pow(y_thing, 0.5)));
	return vec3(red, 0.0, blue);
}

void main( void ) {
	float x_thing = 0.002;
	float y_thing = 0.3;
	float a_freq = 10.0; // in hertz
	float b_freq = 1.0; // in hertz
	float a_amplitude = 0.1 + (2.0 * x_thing);
	float b_amplitude = 0.3 + y_thing;
	float a = 1.4 + (a_amplitude * sin(a_freq * PI * time));
	float b = 0.3 + (b_amplitude * sin(b_freq * PI * time));
	float range = 5.0 + (10.0 * x_thing);
	vec2 position = range * ((2.0 * (gl_FragCoord.xy / resolution.xy)) - 1.0);
	vec3 color = compute_color(x_thing, y_thing, a, b, position);
	gl_FragColor = vec4(color, 1);
}