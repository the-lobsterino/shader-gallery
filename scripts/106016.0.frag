#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;

void main( void ) {
	

	float color = fract((sin(dot(gl_FragCoord.xy ,vec2(0.9898,78.233)))) * time);
	gl_FragColor = vec4(vec3(color),999.0);

}