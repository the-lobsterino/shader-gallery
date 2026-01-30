#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4( 0.5 );
	
	float rho = length(resolution)/3.;
	vec2 p = rho*surfacePosition;
	
	p -= 4.*sign(p);
	p -= 4.*sign(p);
	p -= 4.*sign(p);
	
	gl_FragColor = min(gl_FragColor, abs(1.-length(p)));
}