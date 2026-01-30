#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 resolution;

void main( void ) {
	struct sim{
		float count;
		float timestep;
		vec2 limit;
		float rad;
	};

}