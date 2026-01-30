// @dennishjorth on twitter

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

uniform float u_time;

const float MAX_ITER = 90.0;

float iteration(float a, float b, float c, float d) {
	for (float i = 0.0; i < MAX_ITER; i++) {
		if (a*a + b*b > 10.0) {
			return i;
		}
		else {
			float x = a*a - b*b + c;
			float y = 2.0*a*b + d;
			a = x;
			b = y;
		}
	}
	return MAX_ITER;
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.x ) + mouse / 4.0;

	float delta = 1.25 * (sin(u_time * 0.2) + 1.0);

	float x = position.x - 0.92;
	float y = position.y + 0.00;

	float c_x = -0.54 ;
	float c_y = 0.54 - 0.015 * delta;

	float zx_p1 = cos(sin(time*3.4)*3.14)*0.1;
	float zx_p2 = sin(time*0.1)*3.14;
	float zx = 0.3*cos(zx_p1+zx_p2+time*0.4)+1.475;
	
	
	float length  = iteration(x, y, c_x*zx-zx_p2*0.05+0.5, c_y*zx+zx_p1*0.2); 
	// float color   = 1.0 - length;
	float color = length / MAX_ITER;
	gl_FragColor = vec4(color-0.15, 
			    color,
			    pow(color-0.05*delta,10.0), 1.0);
}