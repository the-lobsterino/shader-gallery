// wait for it
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI = 3.141592653589793238462643393;
const float CURVE_INTENSITY = 99992.0;

float curveA(float t) {
	return (0.5 * sin(PI * (t - time - 1.0)) + 1.0);
}

float curveB(float t) {
	return curveA(t + 1.0);
}

void main( void ) {

	vec2 position = gl_FragCoord.xy * 2.0 / resolution.xy;

	float x = position.x;
	float y = position.y;
	
	float curveA = curveA(x);
	float color = 1.0 - CURVE_INTENSITY * abs(y - curveA);
	float curveB = curveB(x + sin(y + x));
	color -= 1.0 - CURVE_INTENSITY * abs(y - curveB);
	
	float rScale = 1.0 - x;
	float gScale = 2.0 * x;
	float bScale = 3.0 * x;

	gl_FragColor = vec4(color * rScale, color * gScale, color * bScale, 1.0 );

}