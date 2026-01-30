#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4(0);
	vec2 sp = surfacePosition;
	vec2 rt = vec2(4.*length(sp), atan(sp.x, sp.y)*1.);
	sp = rt.x*vec2(sin(rt.y), cos(rt.y));
	#define rot2(PHASE) mat2(cos(PHASE), sin(PHASE), -sin(PHASE), cos(PHASE))
	for(float i = 0.; i <= 1.; i += 1./16.){
		if(abs(sp.x) < 0.5 && abs(sp.y) < 0.5) {gl_FragColor = vec4(1.-i);return;}
		sp *= rot2(3.5*(mouse.y-.5)*sign(sp.x));
		sp.x -= sign(sp.x)*.8;
		//sp.y -= sign(sp.y)*1.8;
		sp.y -= 0.5;
		sp *= 2.;
		
	}
}
//+pk