#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = (surfacePosition+vec2(0.,-0.0))*22.4;
	//p.y = -p.y;
	float a = atan(p.x,p.y+sin(time/2.)*10.);
	float r = log(length(vec2(p.x+p.y,p.x-p.y)));
	float c = sin(mouse.y*62.-r*1.-cos(a*15.0*sin(r*r/8060.14+mouse.x*2.))+a*a);
	c *=cos(r*1.0);
	gl_FragColor = vec4(c*c*1.0,c*1.0,-c*1.0,1.0)*1.0;

}