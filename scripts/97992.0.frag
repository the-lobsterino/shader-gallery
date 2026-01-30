#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main() {
	vec2 p = surfacePosition*10.;
	vec3 c = vec3(0.);
	float a = atan(p.x,p.y);
	float r = length(p);
	float cc = abs(sin(6.*abs(atan(4.*abs(tan(2.*r+a*.5-time*10.))))));
	c = vec3(cc);
	//c = fract(c+vec3(fract(a)+fract(r)));
	gl_FragColor = vec4(c,2);
}