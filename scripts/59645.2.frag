// more dogshit
#ifdef GL_ES
precision highp float;
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

	float t = time*0.357;
	vec2 position = surfacePosition*vec2(1.0,2.0)*(1.1+0.09*sin(0.5*t*0.2+sin(3.0-t-sin(t*.5)*0.3)-sin(t*t)*0.01))+0.01*(sin(t-1.*sin(t*1.3))+0.3)*sin(t*6.0+sin(2.0*t));
	position+=1.5;
	position.x += sin(time*0.1);
	position.y = dot(position,position)*0.75;
	float color = 0.0;
	float height = 0.;
	for(int i=0;i<30;i++)
	{
		position.y += 0.012;
		vec2 a = floor((rot( PI*abs(sin(t/5.)+1.)*.3))*position*20.0);
		vec2 b = floor((rot(-PI*abs(sin(t/5.)-1.)*.3))*position*20.0);
		height = max(height, float(30-i)*0.04*0.5*floor(2.25*sin(a+sin(a*b+t*0.4)-b*sin(a+435.54)).y));
	}
	
	color += height;
	
	gl_FragColor = vec4(vec3(color, color*0.5, sin(color+time/3.)*.75)*clamp(2.3*exp(length(surfacePosition)*-1.1),0.3,1.1),1);

}