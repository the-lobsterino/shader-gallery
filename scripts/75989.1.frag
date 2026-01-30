precision mediump float;//https://wgld.org/d/glsl/g004.html
uniform float time;
uniform vec2  mouse;
uniform vec2  resolution;
#define PI 3.14

void main(void){
	vec2 m = vec2(mouse.x * 2.0 - 1.0, -mouse.y * 2.0 + 1.0);
	vec2 p = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	vec2 p2 = (gl_FragCoord.xy * 2.0 - resolution) / min(resolution.x, resolution.y);
	p.x *= sqrt(abs(sin(p.x * time)));
	p2.x = p2.x*2.0;
	// ring
	float t = 0.05 / abs(0.5 - length(p));
	float t2 = 0.05 / abs(0.5 - length(p2));
	vec3 c = vec3(t * abs(sin(time)), t * abs(sin(time * 1.5)), t * abs(sin(time * 2.0)));
	c += vec3(t2 * abs(sin(time)), t2 * abs(sin(time * 1.5 + PI)), t2 * abs(sin(time * 2.0 + PI)));
	
	gl_FragColor = vec4(c, 1.0);
}