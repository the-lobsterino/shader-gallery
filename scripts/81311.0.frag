#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) { 
	int test = int(mod(gl_FragCoord.y,10.0));
	if(test<5) {
		gl_FragColor=vec4(1.0,1.0,1.0,0.5);
	}
	else {
		gl_FragColor=vec4(0.1,0.0,0.0,0.2);
	}
}