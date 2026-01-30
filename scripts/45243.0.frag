#ifdef GL_ES
precision lowp float;
#endif

#define PI 3.14159265358979

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

mat2 rot(float a) {
	return mat2(cos(a), -sin(a), sin(a), cos(a));
}

void main( void ) {

	vec2 position = surfacePosition*vec2(1.0,1.0)*(1.1+0.09*sin(0.5*time+sin(3.0-time-sin(time*1.5)*0.3)-sin(time*time)*0.01))+0.01*(sin(time-1.*sin(time*1.3))+0.3)*sin(time*6.0+sin(2.0*time));
	float color = 0.0;
	float height = 0.0;
	for(int i=0;i<40;i++) {
		position.y += 0.005;
		vec2 a = floor((rot( PI*abs(sin(time/5.)+1.)*.3))*position*20.0);
		vec2 b = floor((rot(-PI*abs(sin(time/5.)-1.)*.3))*position*20.0);
		vec2 c = fract(position*40.);
		height = max(height, float(30-i)*0.04*0.5*floor(4.0*sin(a+sin(a*b+time)-b*sin(a+2.0)).y));
	}
	
	color += height;
	
	gl_FragColor = vec4(vec3(color, color*0.5, sin(color+time/3.)*.75)*clamp(2.3*exp(length(surfacePosition)*-1.1),0.3,1.1),1);

}