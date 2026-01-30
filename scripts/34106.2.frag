#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform sampler2D backbuffer;
varying vec2 surfacePosition;
uniform vec2 surfaceSize;
void main( void ) {
	const float k = 2.;
	vec2 p = floor(gl_FragCoord.xy/k);
	#define gl_FragCoord (k*p)
	if(p.y <= 0.){
		gl_FragColor = vec4(mod(p.x, 2.));
		return;
	}
	// Cantor's diagnol -> generate unique rows?
	gl_FragColor = mix(
		texture2D(backbuffer, fract((gl_FragCoord.xy)/resolution))
		, 1.-texture2D(backbuffer, fract((gl_FragCoord.xy+vec2((1.-p.y)*(1.+p.x),-1.-2.*mod(p.x+p.y, p.y+1.)))/resolution))
		, 0.5);

}