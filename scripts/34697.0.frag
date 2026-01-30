#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4(1);
	#define sp (surfacePosition)
	
	
	const float BOX = 0.1;
	if(abs(sp.x) > BOX || abs(sp.y) > BOX) return;
	
	gl_FragColor = vec4(vec3(242,101,34)/255.,1);
	
	if(abs(sp.x) > (BOX*.7) || abs(sp.y) > (BOX*.7)) return;
	
	const float LW = 0.01;
	
	if(sp.y <= 0. ){
		if(abs(sp.x) <= LW){
			gl_FragColor = vec4(1);
		}
	}else if(abs(sp.x)-.75*sp.y <= LW){
		if(abs(sp.x)-.75*(sp.y-LW*3.) >= LW){
			gl_FragColor = vec4(1);
		}
	}
	
}