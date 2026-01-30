#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float linewidth = 0.1;
const float scale = 30.0;
const vec2 translate = vec2(0.5);
const float n = 2.0;

float f(float x) {
	return 20.0 * sin(0.5 * time) * sin(x);
}



float online(vec2 p) {
	return  1.0 - step(linewidth * scale, abs(p.y - f(p.x)));
}

void main(void) {

	vec2 p = gl_FragCoord.xy / resolution;
	p -= translate;
	p *= scale;
	
	vec3 c;
	for (float i = 0.0; i <= n; i++) {
		float onx = online(p - vec2(0.0, i - n / 2.0));
		float ony = online(p.yx - vec2(0.0, i - n / 2.0));
		
		float lx = (p.x < f(p.y) + n / 2.0) ? 1.0 : 0.0;
		float rx = (p.x > f(p.y) - n / 2.0) ? 1.0 : 0.0;
		
		float ly = (p.y < f(p.x) + n / 2.0) ? 1.0 : 0.0;
		float ry = (p.y > f(p.x) - n / 2.0) ? 1.0 : 0.0;
		c[int(mod(i, 4.0))] += onx * lx * rx;
		c[int(mod(i, 4.0))] += ony * ly * ry;
	}
	


	gl_FragColor = vec4(c, 2.0);

}