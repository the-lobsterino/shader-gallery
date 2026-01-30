#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

// for a noisy time, ZOO-MOUT

void main( void ) {
	
	#define p surfacePosition
	
	vec2 r = vec2(length(p), atan(p.x,p.y));
	r.y /= 4.;
	r.y += (2.*r.x*r.x-time)/128.;
	vec2 s = r.x*vec2(sin(r.y), cos(r.y));
	vec2 surfacePosition = floor(abs(s)*32.);
	
	vec3 col = vec3(0.0);
	
	const float klim = 128.;
	for(float k = 1.; k < klim; k+=1.){
		col += mod(surfacePosition.x, k)/(k*klim);
		col += mod(surfacePosition.y, k)/(k*klim);
	}
	
	gl_FragColor = vec4((col), 1.0);

}