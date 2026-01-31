#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float mirror_split(float x) {
	if (x > 0.5) {
		x = 1.0 - x;
	}
	x *= 2.0;
	x = min(x, 1.0);
	return x;
}

// where x in range 0..1
float update(float x, float num_bars, float cycle_duration, float cycle_offset) {	
	x = mirror_split(x);
	
	float cycle_now = mod(time, cycle_duration);	   		 // 0..=cycle_dur-1
	cycle_now = mod(cycle_now / cycle_duration + cycle_offset, 1.0); // 0..1
	float x_offset = float(int(cycle_now * num_bars * 2.0)) / num_bars * 2.0; // 0..1

	x = mod(x + x_offset, 1.0);
	x = float(int(x * num_bars)) / num_bars; // 0..1	
	
	x = mirror_split(x);
	
	return x;
}

void main( void ) {
	float num_vertical_bars = 20.0;
	float num_horizontal_bars = 20.0;
	float cycle_duration = 30.0;
	
	float x = gl_FragCoord.x / resolution.x;
	float y = gl_FragCoord.y / resolution.y;
	
	float r = update(x, num_vertical_bars, cycle_duration, 0.0);
	float g = update(y, num_horizontal_bars, cycle_duration, 0.0);
	float b = 1.0;
	
	gl_FragColor = vec4(r, g, b, 1.0);
}