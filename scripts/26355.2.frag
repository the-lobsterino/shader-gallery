#ifdef GL_ES
precision mediump float;
#endif

#define M_PI2 1.57079632679
#define M_PI  3.14159265359
#define M_2PI 6.28318530718

#define NUM_CIRCLES (M_2PI / 8.0)

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main(void) {
	vec2 position = gl_FragCoord.xy / resolution.y - vec2(0.5 * resolution.x / resolution.y, 0.5);
	vec3 color = vec3(0.0);
	float mainRadio = 0.2 * sin(time);
	
	for(float i = 0.0; i <= M_2PI; i += NUM_CIRCLES) {
		color.r += 0.005 / distance(position, vec2(mainRadio * cos(i + time), mainRadio * sin(i)));
		color.g += 0.007 / distance(position, vec2(mainRadio * cos(i), mainRadio * sin(i + time)));
		color.b += 0.01 / distance(position, vec2(mainRadio * cos(i + time), mainRadio * sin(i + time)));
	}
	
	gl_FragColor = vec4(color, 1.0);
}