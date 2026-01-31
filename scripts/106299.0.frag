#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	
	vec4 colorAlpha = vec4(1.0, 0, 1.0, 1.0);
	
	vec3 color = vec3(colorAlpha);
	
	float colorScaleFactor = 0.9;

	gl_FragColor = vec4( color, 1 ) / vec4(colorScaleFactor);

}