#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	float val = 0.0;
	float cur = sin(16.0*time);
	if (cur > 0.3){
		val = 0.5+0.5*cur;
	}
	gl_FragColor = vec4(val*(0.5+0.5*cos(10.0*time)), val*(0.5+0.5*sin(2.0*time)), val*(0.5+0.5*sin(3.0*time+0.5)), val);
}
