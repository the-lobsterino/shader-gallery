#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

const float max_its = 200.;
#define PI 3.1416
vec2 mandelbrot(vec2 z) {
	vec2 c = z;
	for(float i = 0.; i < max_its; i++){
		if(dot(z,z)>4.) return vec2(i / max_its, atan(abs(z.y), z.x) / PI);
		z = vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c;
	}
	return vec2(1., atan(abs(z.y), z.x) / PI);
}
		

void main( void ) {

	vec2 p = surfacePosition;
	vec2 m = mandelbrot((p * mouse.y - vec2(mouse.x - .5, 0.)) * 20.);
	gl_FragColor = vec4(m.y, m.x, .5, 1.);

}