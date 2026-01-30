#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
varying vec2 surfacePosition;
void main( void ) {
	
	
	float y = surfacePosition.y;
	float x = surfacePosition.x;
	
	float w = 0.;
	float p = 0.;
	
	w -= 0.2*exp(-pow(0.7*(20.+10.*cos(time/5.))*x+cos(time/9.)*33., 2.)*0.25);
	
	
	w += 0.2*exp(-pow(5.*x+cos(1.+time/3.)*10., 2.)*0.25);
	
	w += cos(time+x*10.)*0.3*(mouse.y-0.5);
	
	
	gl_FragColor = vec4(1.-1./(1.+abs(y-w)*1e3));
	

}