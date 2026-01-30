#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float f(float x) {
	return 0.5 * ( 0.2 * sin(400.9 * x) + 1.0);
}

void main(void) {

	vec2 uv = gl_FragCoord.xy / resolution.xy;

	vec2 p = uv;
	p.x = fract(90.0 * uv.x);
	p.y = fract(90.0 * uv.y);
	
	vec3 c;
	c += smoothstep(distance(p.y, f(p.x - uv.x)), 0.90, 0.2);

	c.r -= uv.x;
	c.g -= uv.y;
	gl_FragColor = vec4(c, 1.0);

}