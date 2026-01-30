#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {
	gl_FragColor = vec4(1);
	
	vec2 p = surfacePosition*1.3;
	p.y += .3;
	
	float dt = 2.*3.14159/6.28;
	mat2 dt_rot = mat2(cos(dt), sin(dt), -sin(dt), cos(dt));
	for(int i = 0; i <= 5; i++){
		if(abs(p.y-p.x*0.05) < 0.03 && abs(p.x) < 0.55) gl_FragColor = mix(gl_FragColor, vec4(1), 0.5);
		if(abs(p.y-p.x*0.05) < 0.025 && abs(p.x) < 0.5) gl_FragColor = vec4(.0,.5,1.,1);
		p.x -= 0.5*1./3.;
		p *= dt_rot;
		p.x -= 0.5*1./3.;
	}gl_FragColor = vec4(1,0,1,1e1)-gl_FragColor;
	
}