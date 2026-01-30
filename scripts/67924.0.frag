// N270920N Flight Formula
// https://de.wikipedia.org/wiki/Wurfparabel

#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;


#define PI 3.141592653
#define TWO_PI 2.0*PI
#define t time*0.3
#define MAX 30.
void main( void ) {
	vec2 uv = surfacePosition;
	uv *= 16.;
		
	float g = 9.81; // gravitation
	float vo = 10.0; // start velocity
	// float beta = PI*0.25 + mouse.x;	// start degree (45°)
	float mindist = 1e10;
	
	for (float b=0.0;b<=PI;b+=0.1) {
		float beta = b*sin(time*0.1);
		for (float i1=0.0;i1<=10.;i1+=0.2) {
			float x = i1;
			float y = x*tan(beta) - (g*x*x)/(2.*vo*vo*cos(beta)*cos(beta));
			float z = 1.;
			vec3 p = vec3(x,y,z);
					
			float dist = distance(p, vec3(uv.x,uv.y,1.));
			mindist = min(mindist,dist);
		}
	}
	
	gl_FragColor = vec4(vec3(1.-smoothstep(0.0,.3,mindist)), 1.0);		
}