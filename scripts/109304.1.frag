#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define M_PI 3.1415926535897932384626433832795

vec2 rotate(vec2 v, float a) {
	float s = sin(a);
	float c = cos(a);
	mat2 m = mat2(c, s, -s, c);
	return m * v;
}

float func(float x) {
	return pow(x / 10.0, 2.0);
}

float func_d(float x) {
	return x / 50.0;
}

float func2(float x) {
	float angle = atan(func_d(x)) + (M_PI / 2.0) * 4.0;
	float newX = x + sin(angle);
	return sin(newX) + func(x) - cos(angle) * 1.;
}

float calc(float positionY, float valueY) {
	return pow(1.0 - abs(positionY - valueY), 1.0);
}

void main( void ) {
	
	float res = 150.0;
	float mouseVel = 10.0;

	vec2 position = ( gl_FragCoord.xy / resolution.xy * res ) + mouse * mouseVel * res - vec2(res, res / 2.0) * mouseVel / 2.0;

	float x = position.x;
	
	float y1 = func(x);	
	float color1 = calc(position.y, y1);
	
	float y2 = func2(x);
	float color2 = calc(position.y, y2);

	gl_FragColor = vec4(vec3(color1, color2, 0.0), 1.0 );

}