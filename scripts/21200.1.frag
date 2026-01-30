#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

const float PI=3.14159265359;
const float speed=0.3;
const float samples=4.;

float gaussian(float a, float b, float c, float d, float x) {
  return a * exp(-((pow(x-b,2.))/(2.*pow(c,2.))))+d;
}

float testgaussian(float x) {
	float c = 0.4;
	float b = 0.;
	float a = 2. / (c*sqrt(2.*PI));
	float d = 0.;
  	return gaussian(a, b, c, d, x);
}
	
void main( void ) {
	float c = 0.4;
	float b = 1.;
	float a = 1. / (c*sqrt(2.*PI));
	float d = 0.;
	float s = 2.;
	
	float x = gaussian(a,b,c,d,(gl_FragCoord.x/resolution.x)*s);
	float y = gaussian(a,b,c,d,(gl_FragCoord.y/resolution.y)*s);
	
	vec4 color = vec4(1.0);
	vec4 g = vec4(x,y,1.0,1.0);

	color *= abs(g*sin(time)*4.);
	color *= x;
	color *= y;
	
 	gl_FragColor = color;
}
