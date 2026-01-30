#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;
	//pos += 0.01*cos(133.*time);

	const float pi = 3.14159;
	const float n = 1.0;
	
	float radius = length(pos)*4.0 - 1.6;
	float t = atan(pos.y, pos.x)/pi;
	
	float color = 0.0;
	float R = 2./max(resolution.x, resolution.y);
	for (float i = 0.0; i < n; i++){
		color += R/abs(0.2*sin(6.0*pi*(t + i/n*10.*time*0.01)) - radius*(1.+0.8*sin(time)));
	}
	
	gl_FragColor = vec4(vec3((1.-radius)*1.5, 1.5, (1.-radius)*1.15) * color, 1);
	
}