#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 resolution;
varying vec2 surfacePosition;

#define time (sin(time-gl_FragCoord.y/1000.+cos(-time+gl_FragCoord.y/5.)))/sin(time*200.)

void main(){
	vec2 pos = surfacePosition;

	const float pi = 3.14159/2.;
	const float n = 2.0;
	
	float radius = length(pos)*4.0 - 1.6;
	float t = atan(pos.y, pos.x)/pi;
	
	float color = 0.0;
	for (float i = 0.0; i < n; i++){
		color += 0.02/abs(sin(time/1000.)/0.2*sin(3.0*pi*(t + i/n*time*0.05)) - radius);
		color += 0.02/abs(1.1*sin(10.0*pi*(t + i/n*time*0.1)) - radius*10.*(tan(time*200.)*200.));
	}
	
	gl_FragColor = vec4(vec3((sin(time/380.)*10.)+.3, 1.5, 0.) * color, color);
	
}