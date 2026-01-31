#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;


void main( void ) {
	
float w= (5.+5.-5.*5./5.);
float f=pow(w,5.);
if (f<=3125. && f>3124.){
gl_FragColor = vec4(vec3(0.5),1.);
}
	
	
}