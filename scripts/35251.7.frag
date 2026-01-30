#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	gl_FragColor = vec4( 0.0 );
	
	vec2 Z = 16.*(surfacePosition-vec2(0.,-.125));
	float width = 2.;
	for(float i = -1.; i <= 1.; i += 1./15.){
		if(length(Z+cos(Z.x*24.)) < 0.1) gl_FragColor = vec4(1,1.-i*2.,1.-7.*i,1);
		float ph = sign(Z.x)*(dot(Z,Z)/33.-time*i-3.14159/4.);
		Z += vec2(-sign(Z.x)*width*.75,0.25*width);
		Z *= mat2(cos(ph), sin(ph), -sin(ph), cos(ph));
		width /= 1.5;
	}
	

	
}