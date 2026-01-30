#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x) {
	return 0.1 * sin(2.0 * 3.0 * x) / abs(sin(3.0 * x)) + 0.5;

}

void main(void) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec2 p = uv;
	p.x = (10.0 * uv.x);
	p.y = fract(10.0 * uv.y);
	
	vec3 c;
	c += smoothstep(distance(p.y, f(p.x - uv.x)), 0.05, 0.);
	c.b -= uv.x * sin(time -10.);
	c.r -= uv.x *sin(time);
	c.g -= uv.x *sin(time + 10.);
	gl_FragColor = vec4(c, 1.0);

}