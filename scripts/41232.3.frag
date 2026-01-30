#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
uniform vec2 mouse;
varying vec2 surfacePosition;

void main() {
	
	vec3 p = vec3(4.*surfacePosition, 0.0);
	vec2 m = vec2(0.5+0.04*vec2(cos(time/9.), sin(time/10.123)));
	float w = sin(time/8.)*m.y+(m.x-.5)*3.;
	
	p += vec3(0,0,w*0.1);
	
	#define _step p = abs(p+-.5+m.xyx) / dot(p,p)-.5
	_step;_step;_step;_step;_step;_step;_step;_step;_step;
	
	float X = .27*dot(p,p+.25*p.xyy);
	gl_FragColor=vec4(X*X,1,1,1);
	
	gl_FragColor.y = .23*dot(p,p+.25*p.yzz);
	gl_FragColor.z = .18*dot(p,p+.25*p.zxx);
	
}