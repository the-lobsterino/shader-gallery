#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main() {
	vec2 p = surfacePosition*1.;
	vec3 c = vec3(0.);
	float a = atan(p.x,p.y) + 3.0*time;
	float r = length(p);
	float cc = abs(sin(6.*abs(atan(4.*abs(tan(2.*r+a*.5-time*10.))))));
	
	float b = max(0.0, 1.0 - pow(10.0*(r-0.3), 4.0));
	gl_FragColor = b*(0.5+0.5*vec4(sin(a),
			            sin(a+3.1415*2.0*1.0/3.0),
			            sin(a+3.1415*2.0*2.0/3.0), 
			            1.0));
}