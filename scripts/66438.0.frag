#ifdef GL_ES
precision mediump float;
#endif

// dashxdr 20200731
// experiment with lorenz equations

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

float lorenz(vec3 p, float l) {
	float len = length(vec3(10.*(p.y-p.x), 28.*p.x - p.y - p.x*p.z, p.x*p.y - p.z*8./3.));
	return floor(len/l);
}
void main(void) {
	vec2 v = (gl_FragCoord.xy-.5*resolution.xy)/resolution.y;
	vec2 m = mouse;
	vec3 pos = vec3(v.xy, mouse.x-.5);
	pos=vec3(0., 0., 25.) + pos*100.;
	float l = 40.;
	vec2 e = vec2(.01*l, 0.);

	float s = lorenz(pos, l);
	float sx = lorenz(pos + e.xyy, l);
	float sy = lorenz(pos + e.yxy, l);
	float sz = lorenz(pos + e.yyx, l);

	float c = (s==sx && s==sy && s==sz) ? 0. : 1.;

	gl_FragColor = vec4(vec3(c), 1.);
}
