
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
varying vec2 surfacePosition;

void main() {
	vec2 p = surfacePosition*3.;
	float a = atan(p.x,p.y)*.5;
	float r = (length(p)*1.2);
	r = sin(abs(1.5*sin(a-4.5*r+time*1.1)) - r + 1.3*abs(cos(a*7.+r*5.-time*2.))) - .7*abs(sin(a*2.-r*3.+time*1.3));
	//r = fract(r+fract(a)+fract(r));
	gl_FragColor = vec4(r,r*r,.4,1);
}