#extension webGL_OES_standard_derivatives : enable

#ifdef GL_ES
precision mediump float;
#endif


#define PI 3.1415

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec2 ball_pos(float t, float phi) {
	float z = t + phi;
	return vec2(.5) + (.2 * vec2(cos(z), sin(z)));
}

float ball_value(vec2 pos, vec2 ball_p) {
	return pow(1.0 / (distance(pos, ball_p) + .01), 3.0);
}

void main( void ) {

	vec2 position = ( gl_FragCoord.xy / resolution.y ) + vec2(resolution.y / resolution.x - 1.0, 0.0) + (mouse - vec2(.5)) / 4.0;
	vec3 color = vec3(0.0);
	for (int i = 0; i < 3; i++) {
		for (int j = 0; j < 3; j++) {
			color[j] += ball_value(position, ball_pos(time, .03 * float(j) + float(i) * PI * 2.0 / 3.0));
		}
	}
	float step_w = 20.0;
	float step_start = 300.0 + 150.0 * sin(time * 3.0);
	color = smoothstep(step_start, step_start + step_w, color);
	color +=  vec3(0.0, 0.0, .3 * smoothstep(.1, .9, position.y));
	gl_FragColor = vec4(color, 1.0);
	
}