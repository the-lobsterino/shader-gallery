#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	gl_FragColor = vec4( 1.0 );
	
	vec2 Z = 4.*(surfacePosition-vec2(0.,.088));
	float width = .5;
	for(float i = 0.; i <= 1.; i += 1./32.){
		if(i > mouse.y) return;
		
		if(-Z.y - abs(Z.x) > 0. && Z.y > -width) 
			gl_FragColor = vec4(0,.7+i/3.,0,1);

		float ph = -sign(Z.x)*mouse.x*6.28;
		Z += vec2(-sign(Z.x)*width*1.0,0.);
		Z *= mat2(cos(ph), sin(ph), -sin(ph), cos(ph));
		width /= sqrt(1.5);
	}
}