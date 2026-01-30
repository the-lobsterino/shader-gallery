// Rolf Fleckenstein - ändrom3da
// this is even more compact! --> original version here: https://glslsandbox.com/e#79933.3
// used this for inspiration: https://glslsandbox.com/e#79922.0

#extension GL_OES_standard_derivatives : enable
precision highp float;
uniform float time;
uniform vec2 resolution;
#define rotate(a) mat2(cos(a), sin(a), -sin(a), cos(a))

void main(void) {
	float t = time * 0.5; vec3 c = vec3(0.0, 0.0, 0.0);            
	vec2 p = (2.0* gl_FragCoord.xy - resolution.xy) / resolution.y;	p *= rotate(t/5.);	vec2 p0 = p;
	p.y = 4.0/abs(p.y*4.); 
	p.x *= p.y;
	p.y += t;
	c += (sin(10.*p.x) + sin(10.*p.y)) + 0.1;
	c.zx = vec2(.0,1.0); 
	float fog = 1.0 - pow(abs(p0.y), 1.0);
	gl_FragColor = vec4(c, 1.0 - fog);
}