#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

varying vec2 surfacePosition;

void main( void ) {

	vec2 p = surfacePosition;
	#define TH atan(p.x, p.y)
	#define time time + length(p)*333333.*sin(TH*2.0)
	float color = length(p)*1e-2*(1.+0.1*sin(time*3e-3));
	
	color = fract(1./sin(color));

	gl_FragColor = vec4(color);
	
	
}
