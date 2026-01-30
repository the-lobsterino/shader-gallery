#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
void main( void ) {
	gl_FragColor = vec4(0); //plz
	vec2 mypos = vec2(resolution.x/2.,resolution.y/2.);
	vec2 position = ( gl_FragCoord.xy);
	vec2 vel = position-mypos;
	vec2 truemouse = mouse*resolution;
	int lit = 1;
	normalize(vel);
	vel *= 0.0025;
	for(int i = 0; i<1000; i++) {
		mypos += vel;
		if (distance(mypos,truemouse)<10. && lit == 1) {
			lit = 0;
	}
		if (distance(mypos,position)<1. && lit == 1) {
			lit = 2;
}
	if (lit == 2) {
	gl_FragColor = vec4(1,1,1,1);
	}
	if (distance(position,truemouse)<10.) {
		gl_FragColor = vec4(0,0,1,1);
		}
	if (distance(position,vec2(resolution.x/2.,resolution.y/2.))<1.) {
	gl_FragColor = vec4(1,0,0,1);
	}
}
}
//Computer started making really annoying noises while coding this... Hehe.