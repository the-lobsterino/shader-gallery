#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 fakeret2(){
	int a = 1;
	if(a == 0)return vec3(1);
}

void main( void ) {
	
	gl_FragColor = vec4(fakeret2(),1);

}