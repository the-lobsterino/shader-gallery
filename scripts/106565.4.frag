#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 fakeret(float t){
	int a = 0;
	if(a == 1)return vec3(1);
}

void main( void ) {

	for(int i = 0;i<100;i++){
		fakeret(time);
	}
	gl_FragColor = vec4( fakeret(time), 1.0 );

}