#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
uniform vec2 surfaceSize;

void main( void ) {
	gl_FragColor = vec4(0);
	
	float P = length(resolution);
	#define sp surfacePosition
	#define F(x,z) gl_FragColor = max(gl_FragColor, vec4((z/(1.+P*distance(sp.y, x)))))
	#define f(x) F(x,1.)
	
	float w = .01;
	for(float k = .25; k > -.25; k -= .05){
		float z = 3.*cos(sp.x*3.)*cos(sp.y*6.);
		float y = 0.;
		for(float v = 1.; v > 0.; v -= .1){
			float V = pow(4., 3.*(v+0.3*sin(sp.y+time/10.+2.*(k+0.25))));
			y += sin(100000.*(k)+sp.x*V);
		}
		F(k+w*y, z);
	}
	gl_FragColor *= vec4(.5,.6,1.,1.);

}