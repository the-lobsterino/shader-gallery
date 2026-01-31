#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float circleShape(float rad, vec2 pos) {
	float value = distance(pos, vec2(0.5));
	return step(rad, value);
}
void main( void ) {
	vec2 pixelCoord = gl_FragCoord.xy / resolution;
	float rad = 0.5;
	float circle = circleShape(rad, pixelCoord);
	vec3 color = vec3(circle);
	gl_FragColor*=vec4(color, 1.0);
}