#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;

void main( void ) {

	vec2 p = (surfacePosition+vec2(1.,-0.3))*522.4;
	//p.y = -p.y;
	float a = atan(p.x,p.y);
	float r = log(length(vec2(p.x+p.y,p.x-p.y)));
	float c = sin(time*0.8+a-cos(a*41.0+sin(r*9.-a*4.+time*2.))/r);
	c *= cos(r * 10.0);
	gl_FragColor = vec4(0.5 + c * c * 8.55, c * 0.75, -c *.6, 1.0);

}