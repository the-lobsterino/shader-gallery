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
	
	vec2 p = surfacePosition*3.14159;
	
	if(max(abs(p.x), abs(p.y)) < 0.5){
		p *= 32.;
		if(cos(p.x)*cos(p.y) < 0.){
			gl_FragColor = vec4(0);
		}
	}
	
	float phase = time;
	p = surfacePosition*3.14159;
	p *= mat2(cos(time), sin(time), -sin(time), cos(time));
	
	if(max(abs(p.x), abs(p.y)) < 0.5){
		p *= 32.;
		if(cos(p.x)*cos(p.y) < 0.){
			gl_FragColor = vec4(0);
		}
	}
	
}