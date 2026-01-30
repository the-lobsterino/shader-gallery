
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif

uniform vec2 resolution;
uniform float time;
//uniform float battery;
const float battery = 0.8;

void main(void) {
	vec2 uv =
		gl_FragCoord.xy / resolution.xy;
	float w1 =
		step(uv.y+sin(time+ uv.x)*0.02, battery);
	float w2 =
		step(uv.y+sin(time*2.0 + uv.x)*0.01, battery-0.05);
	float c = w1 > w2 ? w1 * .2 : w2 * 0.3;
	gl_FragColor = vec4(
		vec3(c + .3),
		1.0);
}