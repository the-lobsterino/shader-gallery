#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
void main( void ) {

	vec2 p = surfacePosition;
	float f,a,b;
	
	a = 0.050;
	b = a/2.0;
	
	f = sign ((mod(p.x,a)-b) * 
		  (mod(p.y,a)-b));
	float w = sign(mod(p.x,a)-b);
	
	mat2 m  = mat2(500.0*cos(time), 500.0*sin(time),
		       sin(time),       0.0);
	p*=m;
	gl_FragColor = vec4( vec3(p.x+f-w,p.x*f,p.x*w+f),1.0);

}















