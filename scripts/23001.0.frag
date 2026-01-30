#ifdef GL_ES
precision mediump float;
#endif

varying vec2 surfacePosition;
uniform float time;

#define maxiter 40
#define m1 5.0
#define m2 0.3
#define r1 4.0
#define r2 0.5
#define v1 0.5
#define v2 0.9

void main(void) {
	vec2 z = vec2(0);
	float p = 0.;
	float dist = 0.;
	vec4 xy = vec4(cos(time*v1)*r1, sin(time*v1)*r1, cos(time*v2)*r2, sin(time*v2)*r2);
	for (int i=0; i<maxiter; i++) {
		z = vec2(z.x*z.x-z.y*z.y, z.x*z.y*2.0) + surfacePosition;
		p = m1/sqrt((z.x-xy.y)*(z.x-xy.x)+(z.y-xy.x)*(z.y-xy.y))+m2/sqrt((z.x-xy.x)*(z.x-xy.z)+(z.y-xy.y)*(z.y-xy.w));
		if (p > dist) dist = p;
	}
	dist *= .01;
	gl_FragColor = vec4(dist/.3, dist*dist/.04, dist/.1, 1);
}