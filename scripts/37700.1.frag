//Author: Francis Rohner 
//Date: 01/05/2017
#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4(0,0,0,1);
	
	vec2 p = surfacePosition;
	p.y += 0.12 + (0.1 * sin(time));
	p.x += 0.11 + (0.2 * cos(time));
	const float di = 1./9.;
	float dt = 4.*3.14159*di * (time);
	mat2 dt_rot = mat2(cos(dt), sin(dt), -sin(dt), cos(dt));
	for(float i = 0.; i <= 1.; i += di){
		if(abs(p.y) < 0.01 && abs(p.x) < 0.5) gl_FragColor = vec4(1,sin(time),0,1);
		p.x -= 0.1;
		p *= dt_rot;
		p.x -= 0.1;
	}
	
}