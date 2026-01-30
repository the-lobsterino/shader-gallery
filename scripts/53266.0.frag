#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;
#define s surfacePosition

void main( void ) {
	gl_FragColor = vec4( vec3( 40.0 ), 1.0 );
	vec2 sp = surfacePosition;
	// outer
	if(length(sp) < 0.42){
		gl_FragColor = vec4(.08+2.*pow(0.5-sp.x+sp.y*0.25, 6.));
		vec2 si = sp - vec2(-0.10,0.13);
		// inner
		if(length(si) < 0.14){
			si /= 0.5;
			gl_FragColor = vec4(2.*pow(0.5+si.x-si.y*0.25, 6.));
		}
	}
}
