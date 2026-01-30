#ifdef GL_ES
precision mediump float;
#endif

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	float s=sin(time)+gl_FragCoord.x/resolution.x;
	float factor=exp(-s*s);
	
	gl_FragColor=vec4(sin(factor*20.0)/2.0+0.5,sin(factor)/2.0+0.5,sin(factor*30.0)/2.0+0.5,1.0);

}