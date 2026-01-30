// this is dogshit
#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159;
	const float n = 20.0;

	
	pos.x += sin(time + pos.x*pos.y*4.0+pos.x)*0.1;
	
	float v = sin(pos.y+time*0.4);
	
	float radius = length(pos)*4.0 - (1.+v);
	float t = atan(pos.y, pos.x)/pi;
	
	float color = 0.3 + sin(length(pos)+pos.y*4.0+time)*0.4;
	for (float i = 0.0; i < n; i++){
		color += 0.003/abs(0.8*sin(6.0*pi*(t + i/n*time*0.05)) - radius);
	}
	
	gl_FragColor = vec4(vec3(1.6, .91, 0.65) * color, color);
	
}