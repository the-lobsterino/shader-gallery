#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
float fx=2.0;

void main() {
	vec2 p = surfacePosition*10.;
	vec3 c = vec3(0.4);
	float a = atan(p.x,p.y);
	float r = length(p*2.);
	fx/=1.*cos(time/4.0);// remove if you want
	c = vec3((sin(abs(0.8*sin(2.*r-time)))) - .8*abs(sin(a*fx+time)));
	
	gl_FragColor = vec4(c*2.0,1.0);
}