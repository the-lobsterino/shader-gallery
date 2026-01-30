#ifdef GL_ES
precision mediump float;
#endif

#extension GL_OES_standard_derivatives : enable

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {

	float freq = 2.0;
	float px = ((resolution.x/2.0) - gl_FragCoord.x) * freq;
	float py = ((resolution.y/2.0) - gl_FragCoord.y) * freq;
	
	float c = sin(length(vec2(px,py)));
	
	gl_FragColor = vec4(vec3(c),1.0);

}