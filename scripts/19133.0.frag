/*
  Best played on 1.
  Looks much better now.
  By @cakerap
 */

#ifdef GL_ES
precision mediump float;
#endif

#define fogamt 10.0

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float down(float a) {
	return float(int(a));
}

void main(void) {
	vec2 position = gl_FragCoord.xy - resolution / 2.0;
	vec3 col;
	
	if (gl_FragCoord.y < resolution.y / 5.0) {
		float lpos = sin(time + position.x / position.y);
		col = vec3(lpos, cos(time + position.x / position.y), -lpos);
	} else {
		float hpos = sin(time - position.x / position.y);
		col = vec3(hpos, cos(time - position.x / position.y), -hpos);
	}
	
	col *= clamp(sin((gl_FragCoord.y + col.x * 1000.0) * 0.05) * resolution.y, 0.0, 1.0) * abs(0.0 - position.y) / fogamt;
	
	gl_FragColor = vec4(col, 99.0);
}
