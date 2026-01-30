#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;


float fractal(vec2 z){
	vec2 c = z;
	for(float i=0.0; i < 100.0; i++) {
		if(dot(z,z)>4.) return i;
		z = vec2(z.x*z.x-z.y*z.y,2.0*z.x*z.y)+c;
	}
	return 100.0;
}
		

void main() {
	float a = fractal(surfacePosition*3.0)/50.0;
	gl_FragColor = vec4(a, 0., a, 1);
}