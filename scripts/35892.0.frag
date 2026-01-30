#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float wiggle(float x, float y, float alpha) {
	return 1.0 / distance(50.0 * y, cos(time) * 5.0 * alpha * sin(x * 50.0 + cos(time) + time*alpha));
}

void main() {
	vec2 pos = gl_FragCoord.xy / resolution - 0.5;
	
	float theta = 0.3;// * sin(time * 0.4);
	mat2 rot = mat2 (
		cos(theta), -sin(theta),
		sin(theta), cos(theta)
		);
	pos = rot * pos;
	
	float red = wiggle(pos.x, pos.y, 2.0);
	float green = wiggle(pos.x, pos.y, 0.2);
	float blue = wiggle(pos.x, pos.y, 0.9);
	
	vec3 color = vec3(red, green, blue);

	gl_FragColor = vec4(color, 1.0);
}