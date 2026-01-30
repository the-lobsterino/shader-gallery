#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;
	
	pos.x += sin(time+pos.y*5.+2e3/dot(pos,pos))*.1;
	pos.y += cos(time*.5+pos.x*5.)*.1;

	const float pi = 3.14159;
	const float n = 20.0;
	
	float radius = length(pos)*5.0 - 1.6;
	float t = atan(pos.y, pos.x)/pi*5.;
	
	float color = 0.0;
	for (float i = 0.0; i < n; i++){
		color += 0.002/abs(0.25*sin(pi*(t+time*.1 + i/n))+sin(i*.1-time)*.1 - radius);
	}
	
	gl_FragColor = vec4(vec3(1.5, 0.5, 0.15) * color, color);
	
}