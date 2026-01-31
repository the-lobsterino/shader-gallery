#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

vec3 fakeret(float t){
	float a = 0.;
	if(a == 2.){
		return vec3(0);
	}
}

vec3 fakeret2(vec3 p){
	float a = 0.;
	if(a == 2.){
		return vec3(1);
	}
}

void main( void ) {
	gl_FragColor = vec4( mix(fakeret(time),fakeret2(gl_FragCoord.xyz),cos(time*.001)*.5+.5)/2., 1.0 );
}