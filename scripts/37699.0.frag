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
	p.y += 0.12;
	
	//p.y += sin(time) * 0.5;
	//p *= -(sin(time) * 0.5);
	
	const float di = 1./5.;
	float dt = 4.*3.14159*di;
	mat2 dt_rot = mat2(cos(dt) + cos(time), sin(dt) + sin(time), -sin(dt) - sin(time), cos(dt) + cos(time));
	//dt_rot = mat2(sin(time), cos(time), cos(time), sin(time));
	for(float i = 0.; i <= 1.; i += di)
	{
		if(abs(p.y) < 0.01 && abs(p.x) < 0.5) gl_FragColor = vec4(sin(time), tan(time),0.5,1);
		p.x -= 0.5;
		p *= dt_rot;
		p.x -= 0.5;
	}
	
}