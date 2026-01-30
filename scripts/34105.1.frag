#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;

void main( void ) {
	vec2 p = floor(gl_FragCoord.xy);
	
	if(p.y <= 2.){
		float s = fract(p.x/2.)*2.;
		//s += cos(p.x);
		//s += cos(1.+12.34*p.x);
		//s += sin(4.+3.33*p.x - p.x*p.x*.21);
		gl_FragColor = vec4(s>0.);
		return;
	}
	// Cantor's diagnol -> generate unique rows?
	gl_FragColor = 1.-texture2D(backbuffer, fract((gl_FragCoord.xy+vec2(0,-1.-p.x))/resolution));

}