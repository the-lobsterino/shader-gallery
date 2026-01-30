// m00
// Based on: https://gist.github.com/niob/1853604

#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	vec2 position = gl_FragCoord.xy / resolution.xy;
	
	float left = -2.2;
	float right = 1.0;
	float bottom = -1.2;
	float top = 1.2;
	
	float timeCoef = sin(time / 10.0);
	
	right -= timeCoef;
	left += timeCoef;
	top -= timeCoef;
	bottom += timeCoef;

	float x = (position.x - 0.75 + (1.5 * sin(time / 5.0)) / 4.0) * (right - left);
	float y = (position.y - 0.5 + (cos(time / 5.0)) / 4.0) * (bottom - top);
	
	float x0 = x;
	float y0 = y;
	float color;

	const int max_iteration = 100;
	for (int iteration = 0; iteration < max_iteration; iteration++) {
		if (x * x + y * y > 4.0) {
			break;
		}
		
		float xtemp = x * x - y * y + x0;
		y = 2.0 * x * y + y0;
		x = xtemp;

		color = float(iteration);
	}
	
	color = color / 20.0;
	
	gl_FragColor = vec4(color * 0.75, color * 0.8, color, 1.0);
}  