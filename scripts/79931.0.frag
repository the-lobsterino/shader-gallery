#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


float color() {
	float hue = 0.4;
        return hue;
}


void main(void) {
	gl_FragColor = vec4(cos(time)*2.,0.5,1.0,1.0);
}
	