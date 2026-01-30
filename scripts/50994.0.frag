#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

precision mediump float;
uniform float t; // time
uniform vec2  r; // resolution

void main(void){
    float r = 0.5;
    float g = 0.5;
    float b = 0.9;
    gl_FragColor = vec4(r, g, b, 1.0);
	
}