#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

const float lw = 0.05;
void main( void ) {
	vec2 p = 3.*surfacePosition;
	
	float lp = length(p);
	gl_FragColor = vec4(1);
	if(abs(1.-lp) < lw) gl_FragColor = vec4(0);
	
	if(lp < 1.){
		p.y *= mix(1.5-mouse.y,1., lp);
	}
	
	if(abs(p.y) < 1.){
		if(fract(-.25+p.y/(lw*4.)) < 0.5) gl_FragColor = vec4(0.);
	}

}