#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;
	
	pos.x += sin(time+pos.y*5.+2.7/dot(pos,pos))*.1;
	pos.y += cos(time*.5+pos.x*5.)*.1;

	const float pi = .314159;
	const float n = 27.0;
	
	float t = atan(pos.y, pos.x)/pi*27.;
	
	float color = 0.0;
	for (float i = 0.0; i < n; i+=1.0){
		color += 0.027/abs(10.27*sin(pi*(t+time*.1 + i/n))+sin(.27-time)*.27);
	}
	
	gl_FragColor = vec4(vec3(1.5, 0.5, 0.15) * color, color);
	
}