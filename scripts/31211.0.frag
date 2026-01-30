#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
#define p (surfacePosition)
const float sqrt3 = sqrt(3.);
uniform sampler2D b;
float dr(vec2 d){
	float a = texture2D(b, fract((gl_FragCoord.xy+d)/resolution)).r;
	return step(a, 0.4);
}
void main( void ) {
	gl_FragColor = vec4(1);
	float r = .5;
	vec2 v = p+vec2(0.,r*.5);
	if(abs(v.x*sqrt3) < v.y && v.y < r){
		gl_FragColor = vec4(0);
	}
	
	vec2 mouse = (.5 - mouse)*sqrt(length(resolution))*3.;
	gl_FragColor.xyz *= (.125+dr(mouse));
	gl_FragColor.xyz /= (.5+(dr(mouse*vec2(-1,1))));
	
	
}