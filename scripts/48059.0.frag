#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

#define PI 3.14159265359

#define LINE_ORIGIN(t) (0.0025 * cos(5. * (4. * position.y * PI + (t) * 1.)) + position.x)

float quantize(float x, float l) {
	return floor(x * l) / l;
}

void main( void ) {

	vec2 position = (( gl_FragCoord.xy / resolution.xy ) - 0.5);
	position = gl_FragCoord.xy / resolution.xy;
	position.x *= resolution.y / resolution.x;
	//float trueMouseX = mouse.x - 0.5;
	//float mouseX = trueMouseX * resolution.y / resolution.x;
	//position.x -= mouseX;

	float sway = 0.;
	
	//vec3 r = (.0025 + 0.01 * mouseX) / abs(LINE_ORIGIN(time) + sway) * vec3(1., 0.55, 0.25);
	//vec3 b = (.0025 - 0.01 * mouseX) / abs(LINE_ORIGIN(-time) - sway)* vec3(0.25, 0.25, 1.);

	gl_FragColor = vec4( position, 1.0 , 1.0 );

}