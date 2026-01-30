// 070820N 

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform vec2 resolution;
uniform float time;
uniform vec2 mouse;

#define ITERATIONS 36.0
void main() {
	vec2 p = (4.0 * gl_FragCoord.xy - resolution) / min(resolution.x, resolution.y) - vec2(1.5,1.0);
	p *= 8.0;
	for(float i = 1.0; i < ITERATIONS; i++) {
		p.x += 0.1 / i * sin(i * p.x*p.x*p.y*p.y);
		p.y += 0.1 / i * cos(i * p.y*p.y*p.x*p.x);
		
		p /= dot(p,p);
	}

	vec3 col;
	col = vec3(sin(p.x + time), sin(p.y + time), sin(p.x));
	gl_FragColor = vec4(col, 1.0);
}
