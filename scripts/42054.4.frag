#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

/**
 * Returns accurate MOD when arguments are approximate integers.
 */
float modI(float a,float b) {
    float m=a-floor((a+0.5)/b)*b;
    return floor(m+0.5);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.xy );

	float scaleTime = time / 1000.0 + 1. / (time * time);
	float x = abs(position.x - 0.5);
	x = max(x, 0.001);
	x = x * x * x;
	float y = abs(position.y - 0.5);
	y = max(y, 0.1);
	x = min(x, y);
	y = y * y;
	float baseRed = 0.5;
	float baseGreen = 0.5;
	float red = baseRed * tan(0.5 + floor(10. * x) + scaleTime);
	float green = baseGreen * tan(0.5 + floor(10. * x / y) + scaleTime);

	float blue;
	if (modI(ceil(time * 10. + -(y / x) * 100.), 3.) == 0.) {
		//blue = 0.3 + red / green;
	} else {
		//blue = 0.3 + green / red;
	}
	if (abs(sin(x * 100.0 + time) + cos(y * 20.0 + time)) < 0.3) {
		float oldBlue = blue;
		blue = red;
		red = green;
		green = oldBlue;
	}
	gl_FragColor = vec4( vec3( blue, green, red), 1. );

}